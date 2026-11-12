const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Whether a string looks like a game date (YYYY-MM-DD). */
export function isValidGameDate(date: string) {
  return DATE_PATTERN.test(date);
}

/**
 * Optional fixed game date for development, e.g. `VITE_GAME_DATE=2026-10-03`
 * in apps/web/.env, to play a date that has questions in the question bank.
 */
const OVERRIDE_DATE: string | undefined = import.meta.env.VITE_GAME_DATE;

if (OVERRIDE_DATE && !DATE_PATTERN.test(OVERRIDE_DATE)) {
  console.warn(
    `Ignoring VITE_GAME_DATE="${OVERRIDE_DATE}": expected the format YYYY-MM-DD.`,
  );
}

/**
 * Today's game date as YYYY-MM-DD, in the player's local timezone, so the
 * daily game rolls over at their midnight rather than UTC midnight.
 */
export function getTodayGameDate(now = new Date()) {
  if (OVERRIDE_DATE && DATE_PATTERN.test(OVERRIDE_DATE)) return OVERRIDE_DATE;

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
