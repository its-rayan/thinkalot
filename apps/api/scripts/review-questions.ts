/**
 * Steps through draft questions in the bank so you can approve or reject them.
 *
 *   pnpm --filter api questions:review
 *
 * Approved questions can be scheduled; rejected ones are deleted from the bank.
 * Flagged questions (ones the fact-check was unsure about) come first. To fix
 * a question's wording, skip it, edit src/db/question-bank.json, and approve
 * it next time. Every decision is saved straight away, so you can quit at any
 * point and carry on later.
 */
import readline from "node:readline";
import { LETTERS, QUESTIONS_PER_DAY, readBank, writeBank } from "./lib/bank.js";

async function main() {
  const bank = await readBank();
  const drafts = bank
    .filter((q) => q.status === "draft")
    .sort(
      (a, b) => Number(Boolean(b.reviewNote)) - Number(Boolean(a.reviewNote)),
    );

  if (drafts.length === 0) {
    console.log("No draft questions to review.");
    return;
  }

  const rl = readline.createInterface({ input: process.stdin });
  // Reading lines from an iterator, rather than rl.question(), keeps input
  // typed ahead or piped in, and ends cleanly when the input closes.
  const lines = rl[Symbol.asyncIterator]();
  async function ask() {
    process.stdout.write("[a]pprove  [r]eject  [s]kip  [q]uit > ");
    const line = await lines.next();
    return line.done ? "q" : String(line.value).trim().toLowerCase();
  }
  let approved = 0;
  let rejected = 0;

  try {
    for (const [index, question] of drafts.entries()) {
      console.log(
        `\n[${index + 1}/${drafts.length}] ${question.category} · ${question.difficulty} · #${question.id}`,
      );
      console.log(question.question);
      for (const letter of LETTERS) {
        const mark = letter === question.correctAnswer ? "✓" : " ";
        console.log(`  ${mark} ${letter}: ${question.answers[letter]}`);
      }
      console.log(`  ${question.explanation}`);
      if (question.reviewNote) console.log(`  ⚠ ${question.reviewNote}`);

      let choice = "";
      while (!["a", "r", "s", "q"].includes(choice)) {
        choice = await ask();
      }
      if (choice === "q") break;
      if (choice === "a") {
        question.status = "approved";
        delete question.reviewNote;
        approved++;
      }
      if (choice === "r") {
        bank.splice(bank.indexOf(question), 1);
        rejected++;
      }
      if (choice !== "s") await writeBank(bank);
    }
  } finally {
    rl.close();
  }

  const unused = bank.filter((q) => q.status === "approved" && !q.usedOn);
  console.log(
    `\nApproved ${approved}, rejected ${rejected}. The bank has ${unused.length} approved, unused questions (${Math.floor(unused.length / QUESTIONS_PER_DAY)} days).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
