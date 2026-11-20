/**
 * Schedules approved, unused bank questions onto days that don't have a game.
 *
 *   pnpm --filter api questions:schedule --through 2026-12-31
 *   pnpm --filter api questions:schedule --through 2026-12-31 --rebuild-from 2026-11-20
 *
 * Fills every missing day from today up to --through. Days that already have
 * questions are left alone, so questions you've edited are safe. Each bank
 * question is used once only: scheduling it sets `usedOn` in the bank.
 *
 * --rebuild-from clears that day and every later day first, returns their
 * questions to the bank as unused, and schedules them again. It refuses dates
 * that may already be in play, and changes nothing unless it can fill every
 * day up to --through.
 *
 * Review the changes, then commit the bank and the daily files together: the
 * API only reads these files, so new days go live on deploy.
 */
import type { DailyQuiz } from "../src/api/v1/questions/domain.js";
import { getLatestPlayableDate } from "../src/utils/dates.js";
import {
  type BankQuestion,
  DIFFICULTIES,
  datesBetween,
  formatDate,
  getFlag,
  isDateString,
  listMonths,
  QUESTIONS_PER_DAY,
  readBank,
  readMonth,
  shuffle,
  writeBank,
  writeMonth,
} from "./lib/bank.js";

/** No more than this many questions from one category on a single day. */
const MAX_PER_CATEGORY = 2;

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

/** Picks a day's questions, spread across categories, easiest first. */
function pickDay(pool: BankQuestion[]) {
  const candidates = shuffle(pool);
  const picked: BankQuestion[] = [];
  const perCategory = new Map<string, number>();

  for (const question of candidates) {
    if (picked.length === QUESTIONS_PER_DAY) break;
    const count = perCategory.get(question.category) ?? 0;
    if (count >= MAX_PER_CATEGORY) continue;
    picked.push(question);
    perCategory.set(question.category, count + 1);
  }
  // Not enough variety in the pool: top up from any category.
  for (const question of candidates) {
    if (picked.length === QUESTIONS_PER_DAY) break;
    if (!picked.includes(question)) picked.push(question);
  }

  return picked.sort(
    (a, b) =>
      DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty),
  );
}

async function main() {
  const through = getFlag("through");
  const rebuildFrom = getFlag("rebuild-from");
  if (!through || !isDateString(through)) {
    fail(
      "Usage: pnpm --filter api questions:schedule --through <YYYY-MM-DD> [--rebuild-from <YYYY-MM-DD>]",
    );
  }
  if (rebuildFrom !== undefined) {
    if (!isDateString(rebuildFrom)) {
      fail("--rebuild-from must be a date, e.g. --rebuild-from 2026-11-20");
    }
    const latestPlayable = getLatestPlayableDate();
    if (rebuildFrom <= latestPlayable) {
      fail(
        `--rebuild-from must be after ${latestPlayable}: games up to that date may already be in play somewhere in the world.`,
      );
    }
  }

  const today = formatDate(new Date());
  const bank = await readBank();
  const months = new Map<string, DailyQuiz[]>();
  for (const month of await listMonths()) {
    months.set(month, await readMonth(month));
  }

  // Clear the days being rebuilt and return their questions to the bank.
  let cleared = 0;
  if (rebuildFrom) {
    for (const [month, days] of months) {
      const kept = days.filter((day) => day.date < rebuildFrom);
      cleared += days.length - kept.length;
      months.set(month, kept);
    }
    for (const question of bank) {
      if (question.usedOn && question.usedOn >= rebuildFrom) {
        delete question.usedOn;
      }
    }
  }

  const scheduled = new Set([...months.values()].flat().map((day) => day.date));
  const missing = datesBetween(today, through).filter(
    (date) => !scheduled.has(date),
  );

  let pool = bank.filter((q) => q.status === "approved" && !q.usedOn);
  const added: string[] = [];

  for (const date of missing) {
    if (pool.length < QUESTIONS_PER_DAY) break;
    const picked = pickDay(pool);
    pool = pool.filter((question) => !picked.includes(question));
    for (const question of picked) question.usedOn = date;

    const month = date.slice(0, 7);
    const days = months.get(month) ?? [];
    days.push({
      date,
      // Bank-only fields stay in the bank; IDs are renumbered before saving.
      questions: picked.map(
        ({ status, usedOn, reviewNote, ...question }) => question,
      ),
    });
    months.set(month, days);
    added.push(date);
  }

  const shortBy = missing.length - added.length;
  if (shortBy > 0 && rebuildFrom) {
    fail(
      `Not enough approved, unused questions to rebuild: ${missing.length} days need ${missing.length * QUESTIONS_PER_DAY}, the bank has ${pool.length + added.length * QUESTIONS_PER_DAY}. Nothing was changed. Add more with questions:write and approve them with questions:review.`,
    );
  }
  if (added.length === 0 && cleared === 0) {
    if (missing.length === 0) {
      console.log(`Nothing to do: every day up to ${through} has a game.`);
      return;
    }
    fail(
      `No days scheduled: the bank has ${pool.length} approved, unused questions and each day needs ${QUESTIONS_PER_DAY}. Add more with questions:write and approve them with questions:review.`,
    );
  }

  for (const [month, days] of months) {
    // Number each day's questions q1–q8 in their final order.
    for (const day of days) {
      day.questions = day.questions.map((question, index) => ({
        ...question,
        id: `${day.date}-q${index + 1}`,
      }));
    }
    await writeMonth(month, days);
  }
  await writeBank(bank);

  if (rebuildFrom) {
    console.log(`Cleared ${cleared} days from ${rebuildFrom}.`);
  }
  if (added.length > 0) {
    console.log(
      `Scheduled ${added.length} days (${added[0]} to ${added[added.length - 1]}).`,
    );
  }
  if (shortBy > 0) {
    console.warn(
      `${shortBy} days up to ${through} still have no game: not enough approved, unused questions. Add more with questions:write and approve them with questions:review.`,
    );
  }
  console.log(
    `${pool.length} approved questions are left unused. Review the changes, then commit the bank and daily files together.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
