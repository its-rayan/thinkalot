/**
 * Adds draft daily questions for a month, picked from the question bank.
 *
 *   pnpm --filter api questions:generate 2026-12
 *
 * Writes src/db/questions/drafts/<month>.json. Only days that are missing and
 * not in the past are added; days already in the file are never changed, so
 * questions you've reviewed or edited are safe. Review the result, then commit
 * it: the API only reads these files, so new questions go live on deploy.
 */
import fs from "node:fs/promises";
import path from "node:path";
import type { DailyQuiz, Question } from "../src/api/v1/questions/domain.js";
import questionBank from "../src/db/question-bank.json" with { type: "json" };
import { getDraftFilePath, validateMonth } from "../src/utils/files.js";

/** Must match the round length the web app plays. */
const QUESTIONS_PER_DAY = 8;

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Fisher–Yates shuffle, so every order is equally likely. */
function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickQuestions(bank: Question[], date: string): Question[] {
  return shuffle(bank)
    .slice(0, QUESTIONS_PER_DAY)
    .map((question, index) => ({ ...question, id: `${date}-q${index + 1}` }));
}

async function readExisting(filePath: string): Promise<DailyQuiz[]> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as DailyQuiz[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function main() {
  const month = process.argv[2];
  if (!month) {
    console.error("Usage: pnpm --filter api questions:generate <YYYY-MM>");
    process.exit(1);
  }
  validateMonth(month);

  const bank = questionBank.questions as Question[];
  if (bank.length < QUESTIONS_PER_DAY) {
    console.error(
      `The question bank has ${bank.length} questions but each day needs ${QUESTIONS_PER_DAY}.`,
    );
    process.exit(1);
  }

  const filePath = getDraftFilePath(month);
  const existing = await readExisting(filePath);
  const existingDates = new Set(existing.map((day) => day.date));

  const [year, monthIndex] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthIndex, 0).getDate();
  const today = formatDate(new Date());

  const added: DailyQuiz[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = formatDate(new Date(year, monthIndex - 1, day));
    if (date < today || existingDates.has(date)) continue;
    added.push({ date, questions: pickQuestions(bank, date) });
  }

  if (added.length === 0) {
    console.log(
      `Nothing to add: ${month} already has every day from today on.`,
    );
    return;
  }

  const days = [...existing, ...added].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(days, null, 2)}\n`, "utf8");

  console.log(
    `Added ${added.length} days (${added[0].date} to ${added[added.length - 1].date}) to ${path.relative(process.cwd(), filePath)}.`,
  );
  console.log("Review the questions, then commit the file to publish them.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
