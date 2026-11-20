/**
 * Checks the question supply. Exits with an error, so the daily "Question
 * supply" GitHub Action fails and GitHub emails you, when:
 *   - fewer than MIN_DAYS consecutive days from today have a game, or
 *   - a game that hasn't started yet anywhere repeats a question from
 *     another day. (Games already in play can't be changed, so their
 *     repeats aren't reported.)
 * It also reports how many approved, unused questions are left in the bank.
 *
 *   pnpm --filter api questions:check
 *   node apps/api/scripts/check-question-supply.mjs [--min-days 14]
 *
 * Plain Node with no dependencies, so CI can run it without installing.
 */
import fs from "node:fs";
import path from "node:path";

const DB_DIR = path.resolve(import.meta.dirname, "../src/db");
const DRAFT_DIR = path.join(DB_DIR, "questions/drafts");
const BANK_PATH = path.join(DB_DIR, "question-bank.json");
/** Must match the round length the web app plays. */
const QUESTIONS_PER_DAY = 8;

const minDaysFlag = process.argv.indexOf("--min-days");
const MIN_DAYS =
  minDaysFlag === -1 ? 14 : Number(process.argv[minDaysFlag + 1]);

if (!Number.isInteger(MIN_DAYS) || MIN_DAYS < 1) {
  console.error(
    "--min-days must be a whole number of days, e.g. --min-days 14",
  );
  process.exit(1);
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

/** Keep in step with normalise() in scripts/lib/bank.ts. */
function normalise(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

const days = fs
  .readdirSync(DRAFT_DIR)
  .filter((file) => /^\d{4}-\d{2}\.json$/.test(file))
  .flatMap((file) =>
    JSON.parse(fs.readFileSync(path.join(DRAFT_DIR, file), "utf8")),
  );
const daysByDate = new Map(days.map((day) => [day.date, day]));
const today = new Date();
const todayString = formatDate(today);
/** Same rule as getLatestPlayableDate() in src/utils/dates.ts (UTC+14). */
const latestPlayable = formatDate(
  new Date(today.getTime() + 14 * 60 * 60 * 1000),
);
const problems = [];

// 1. Walk forward from today until the first day without a full game.
let ready = 0;
let firstGap = null;
for (let i = 0; i < 366; i++) {
  const date = new Date(today);
  date.setUTCDate(today.getUTCDate() + i);
  const day = daysByDate.get(formatDate(date));
  if (!day || day.questions.length < QUESTIONS_PER_DAY) {
    firstGap = formatDate(date);
    break;
  }
  ready++;
}

// 2. Find questions in games not yet in play that appear on another day.
const datesByQuestion = new Map();
for (const day of days) {
  for (const question of day.questions) {
    const key = normalise(question.question);
    const dates = datesByQuestion.get(key) ?? new Set();
    dates.add(day.date);
    datesByQuestion.set(key, dates);
  }
}
const repeats = [...datesByQuestion.values()]
  .map((dates) => [...dates].sort())
  .filter(
    (dates) => dates.length > 1 && dates[dates.length - 1] > latestPlayable,
  );

// 3. Count what's left in the bank to schedule.
const bank = JSON.parse(fs.readFileSync(BANK_PATH, "utf8")).questions;
const unused = bank.filter((q) => q.status === "approved" && !q.usedOn);
const drafts = bank.filter((q) => q.status === "draft");
const spareDays = Math.floor(unused.length / QUESTIONS_PER_DAY);

console.log(
  `${ready} day${ready === 1 ? "" : "s"} of games ready from ${todayString}; first missing day is ${firstGap}.`,
);
console.log(
  `Bank: ${unused.length} approved, unused questions (${spareDays} more days) and ${drafts.length} drafts waiting for review.`,
);

if (ready < MIN_DAYS) {
  problems.push(
    spareDays > 0
      ? `Running low on scheduled games (minimum ${MIN_DAYS} days). Schedule more with "pnpm --filter api questions:schedule --through <YYYY-MM-DD>", then commit and deploy.`
      : `Running low on scheduled games (minimum ${MIN_DAYS} days), and the bank has no spare questions. Write more with "pnpm --filter api questions:write <count>", approve them with "questions:review", then schedule them.`,
  );
}
if (repeats.length > 0) {
  const earliest = repeats
    .map((dates) => dates.find((date) => date > latestPlayable))
    .sort()[0];
  problems.push(
    `${repeats.length} question${repeats.length === 1 ? " appears" : "s appear"} on more than one day, e.g. one is on ${repeats[0].length} days, from ${repeats[0][0]} to ${repeats[0][repeats[0].length - 1]}.` +
      ` Rebuild from ${earliest} with "pnpm --filter api questions:schedule --through <YYYY-MM-DD> --rebuild-from ${earliest}".`,
  );
}

if (problems.length > 0) {
  for (const problem of problems) console.error(problem);
  process.exit(1);
}
console.log("OK");
