/**
 * Writes new questions with Claude, fact-checks them, and adds the ones that
 * pass to the question bank as drafts.
 *
 *   pnpm --filter api questions:write 100
 *   pnpm --filter api questions:write 30 --category Sport
 *
 * Needs ANTHROPIC_API_KEY in apps/api/.env (or an `ant auth login` profile).
 * It only runs on your machine; the deployed API never calls Claude.
 *
 * Each batch takes two requests:
 *   1. Write: Claude writes questions, avoiding everything already in the bank.
 *   2. Check: a separate request answers each question without seeing the
 *      answer key, and looks for ambiguity and repeats of bank questions.
 * Questions where the check picks a different answer, or finds a repeat, are
 * dropped. Ones it is unsure about are kept with a `reviewNote`.
 *
 * New questions are drafts: approve them with `pnpm --filter api questions:review`
 * before they can be scheduled.
 */
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import type { Category } from "../src/api/v1/questions/domain.js";
import {
  type BankQuestion,
  CATEGORIES,
  DIFFICULTIES,
  getFlag,
  LETTERS,
  nextId,
  normalise,
  readBank,
  shuffle,
  writeBank,
} from "./lib/bank.js";

const MODEL = "claude-opus-5-5";
const BATCH_SIZE = 20;

const Answers = z.object({
  A: z.string(),
  B: z.string(),
  C: z.string(),
  D: z.string(),
});

const WrittenQuestions = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      answers: Answers,
      correctAnswer: z.enum(LETTERS),
      category: z.enum(CATEGORIES as [Category, ...Category[]]),
      difficulty: z.enum(DIFFICULTIES as ["Easy", "Medium", "Hard"]),
      explanation: z.string(),
    }),
  ),
});
type WrittenQuestion = z.infer<typeof WrittenQuestions>["questions"][number];

const CheckResults = z.object({
  results: z.array(
    z.object({
      number: z.number().int(),
      answer: z.enum(LETTERS),
      confident: z.boolean(),
      problem: z
        .string()
        .describe(
          "Anything that makes the question unfair: more than one defensible answer, an outdated or disputed fact, a misleading wording. Empty if none.",
        ),
      repeatOf: z
        .string()
        .describe(
          "The existing bank question this asks the same fact as, copied exactly. Empty if none.",
        ),
    }),
  ),
});

const WRITE_INSTRUCTIONS = `You write questions for Thinkalot, a daily multiple-choice trivia game played worldwide. Each day's game has 8 questions with a 10-second timer each, so every question must be quick to read and answer.

What makes a good question:
- One answer that is clearly and verifiably correct, and three plausible but definitely wrong answers.
- A fact that won't change: avoid current record holders, reigning champions, "latest" anything, populations and other figures that drift.
- Short: the question under 120 characters, each answer under 40.
- Fair to a global audience. Avoid facts only one country would know, unless the question is about that country's well-known landmarks, history or culture.
- No trick wording, no "all/none of the above", no negatives like "Which is NOT…".
- British English spelling.
- The explanation is one sentence that confirms the answer and adds an interesting detail.

Difficulty: Easy is something most adults know; Medium is something a keen quiz player knows; Hard is something few people know but most find interesting once told.

Never ask about the same fact as a question already in the bank, even in different words. The existing bank is below.`;

const CHECK_INSTRUCTIONS = `You are the fact-checker for Thinkalot, a daily multiple-choice trivia game. For each numbered question, work out the correct answer yourself, then report:
- answer: the letter you believe is correct.
- confident: true only if you are sure the answer is correct and the other three are wrong.
- problem: anything that makes the question unfair, or empty if none.
- repeatOf: the existing bank question it duplicates (asks the same fact, even if worded differently), copied exactly, or empty if none.

Report on every question, in order. The existing bank is below.`;

function describeBank(bank: BankQuestion[]) {
  if (bank.length === 0) return "(The bank is empty.)";
  return bank
    .map(
      (q) => `- [${q.category}] ${q.question} → ${q.answers[q.correctAnswer]}`,
    )
    .join("\n");
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function readResponse<T>(
  response: { stop_reason: string | null; parsed_output: T | null },
  step: string,
): T {
  if (response.stop_reason === "refusal") {
    throw new Error(`Claude declined the ${step} request.`);
  }
  if (response.stop_reason === "max_tokens" || !response.parsed_output) {
    throw new Error(`The ${step} response was cut off or malformed.`);
  }
  return response.parsed_output;
}

/** Moves the correct answer to a random letter: models favour B and C. */
function shuffleAnswers(question: WrittenQuestion): WrittenQuestion {
  const options = shuffle(LETTERS.map((letter) => question.answers[letter]));
  const correctText = question.answers[question.correctAnswer];
  return {
    ...question,
    answers: { A: options[0], B: options[1], C: options[2], D: options[3] },
    correctAnswer: LETTERS[options.indexOf(correctText)],
  };
}

/** Local checks the schema can't express. Returns a reason to drop, if any. */
function findProblem(question: WrittenQuestion, seen: Set<string>) {
  const options = LETTERS.map((letter) => normalise(question.answers[letter]));
  if (options.some((option) => option === "")) return "an empty answer";
  if (new Set(options).size !== 4) return "two identical answers";
  if (!question.question.trim() || !question.explanation.trim()) {
    return "missing question or explanation";
  }
  if (seen.has(normalise(question.question))) return "already in the bank";
  return undefined;
}

async function writeBatch(
  client: Anthropic,
  bank: BankQuestion[],
  count: number,
  category: Category | undefined,
) {
  const mix = category
    ? `All ${count} questions should be in the ${category} category.`
    : `Spread them across the categories (${CATEGORIES.join(", ")}), roughly evenly.`;

  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: {
      effort: "medium",
      format: betaZodOutputFormat(WrittenQuestions),
    },
    system: [
      { type: "text", text: WRITE_INSTRUCTIONS },
      {
        type: "text",
        text: describeBank(bank),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Write ${count} new questions. ${mix} Aim for about 40% Easy, 40% Medium and 20% Hard. Cover varied topics within each category rather than clustering on one theme.`,
      },
    ],
  });
  return readResponse(response, "write").questions;
}

async function checkBatch(
  client: Anthropic,
  bank: BankQuestion[],
  questions: WrittenQuestion[],
) {
  const list = questions
    .map(
      (q, index) =>
        `${index + 1}. ${q.question}\n${LETTERS.map((l) => `   ${l}: ${q.answers[l]}`).join("\n")}`,
    )
    .join("\n\n");

  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: {
      effort: "high",
      format: betaZodOutputFormat(CheckResults),
    },
    system: [
      { type: "text", text: CHECK_INSTRUCTIONS },
      {
        type: "text",
        text: describeBank(bank),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: list }],
  });
  return readResponse(response, "check").results;
}

async function main() {
  const count = Number(process.argv[2]);
  if (!Number.isInteger(count) || count < 1) {
    fail(
      "Usage: pnpm --filter api questions:write <count> [--category <name>]",
    );
  }
  const category = getFlag("category") as Category | undefined;
  if (category && !CATEGORIES.includes(category)) {
    fail(`--category must be one of: ${CATEGORIES.join(", ")}`);
  }

  const client = new Anthropic();
  const bank = await readBank();
  const seen = new Set(bank.map((q) => normalise(q.question)));
  const dropped: string[] = [];
  let added = 0;
  let flagged = 0;

  // Allow some spare batches, since the check drops a few questions.
  const maxBatches = Math.ceil(count / BATCH_SIZE) + 3;
  for (let batch = 1; batch <= maxBatches && added < count; batch++) {
    const want = Math.min(BATCH_SIZE, count - added);
    console.log(`Batch ${batch}: writing ${want} questions…`);

    let candidates: WrittenQuestion[];
    let results: z.infer<typeof CheckResults>["results"];
    try {
      candidates = [];
      for (const written of await writeBatch(client, bank, want, category)) {
        const problem = findProblem(written, seen);
        if (problem) {
          dropped.push(`${written.question} (${problem})`);
          continue;
        }
        seen.add(normalise(written.question));
        candidates.push(shuffleAnswers(written));
      }
      console.log(`Batch ${batch}: checking ${candidates.length} questions…`);
      results = await checkBatch(client, bank, candidates);
    } catch (error) {
      if (error instanceof Anthropic.AuthenticationError) {
        fail(
          "Claude rejected the API key. Set ANTHROPIC_API_KEY in apps/api/.env, or run `ant auth login`.",
        );
      }
      if (error instanceof Anthropic.APIError || error instanceof Error) {
        console.warn(`Batch ${batch} skipped: ${error.message}`);
        continue;
      }
      throw error;
    }

    const byNumber = new Map(results.map((result) => [result.number, result]));
    candidates.forEach((question, index) => {
      const result = byNumber.get(index + 1);
      if (!result) {
        dropped.push(`${question.question} (the check skipped it)`);
      } else if (result.answer !== question.correctAnswer) {
        dropped.push(
          `${question.question} (the check answered "${question.answers[result.answer]}", not "${question.answers[question.correctAnswer]}")`,
        );
      } else if (result.repeatOf.trim()) {
        dropped.push(`${question.question} (repeats "${result.repeatOf}")`);
      } else if (added < count) {
        const notes = [
          result.confident ? "" : "The fact-check wasn't sure of the answer.",
          result.problem.trim(),
        ].filter(Boolean);
        bank.push({
          id: nextId(bank),
          ...question,
          status: "draft",
          ...(notes.length > 0 && { reviewNote: notes.join(" ") }),
        });
        added++;
        if (notes.length > 0) flagged++;
      }
    });

    // Save after every batch, so an interrupted run keeps its progress.
    await writeBank(bank);
  }

  console.log(
    `\nAdded ${added} draft questions to the bank (${flagged} flagged for a closer look).`,
  );
  if (dropped.length > 0) {
    console.log(`Dropped ${dropped.length}:`);
    for (const reason of dropped) console.log(`  - ${reason}`);
  }
  if (added < count) {
    console.warn(`Asked for ${count}; run again to top up.`);
  }
  console.log("Next: pnpm --filter api questions:review");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
