/**
 * Checks how many days of questions are ready, counting consecutive days from
 * today. Exits with an error when fewer than MIN_DAYS are left, so the daily
 * "Question supply" GitHub Action fails and GitHub emails you.
 *
 *   pnpm --filter api questions:check
 *   node apps/api/scripts/check-question-supply.mjs [--min-days 14]
 *
 * Plain Node with no dependencies, so CI can run it without installing.
 */
import fs from "node:fs";
import path from "node:path";

const DRAFT_DIR = path.resolve(
  import.meta.dirname,
  "../src/db/questions/drafts",
);
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

function loadMonth(month, cache) {
  if (!cache.has(month)) {
    const file = path.join(DRAFT_DIR, `${month}.json`);
    let days = [];
    if (fs.existsSync(file)) {
      days = JSON.parse(fs.readFileSync(file, "utf8"));
    }
    cache.set(month, new Map(days.map((day) => [day.date, day])));
  }
  return cache.get(month);
}

const cache = new Map();
const today = new Date();
let ready = 0;
let firstGap = null;

// Walk forward from today until the first day without a full set of questions.
for (let i = 0; i < 366; i++) {
  const date = new Date(today);
  date.setUTCDate(today.getUTCDate() + i);
  const dateString = formatDate(date);
  const day = loadMonth(dateString.slice(0, 7), cache).get(dateString);
  if (!day || day.questions.length < QUESTIONS_PER_DAY) {
    firstGap = dateString;
    break;
  }
  ready++;
}

const summary = `${ready} day${ready === 1 ? "" : "s"} of questions ready from ${formatDate(today)}; first missing day is ${firstGap}.`;

if (ready < MIN_DAYS) {
  console.error(`Running low: ${summary}`);
  console.error(
    `Add more with "pnpm --filter api questions:generate ${firstGap?.slice(0, 7)}", review them, then commit and deploy.`,
  );
  process.exit(1);
}

console.log(`OK: ${summary}`);
