/** The furthest-ahead timezone (UTC+14, e.g. Kiribati), in milliseconds. */
const MAX_UTC_OFFSET_MS = 14 * 60 * 60 * 1000;

/**
 * The latest game date that has started anywhere in the world: today's date
 * in UTC+14. Players pick the game date from their own local clock, so any
 * date up to this one is someone's "today"; later dates are in the future
 * for everyone.
 */
export function getLatestPlayableDate(now = new Date()) {
  return new Date(now.getTime() + MAX_UTC_OFFSET_MS).toISOString().slice(0, 10);
}

/** Whether a YYYY-MM-DD game date has started somewhere in the world. */
export function isPlayableDate(date: string, now = new Date()) {
  return date <= getLatestPlayableDate(now);
}
