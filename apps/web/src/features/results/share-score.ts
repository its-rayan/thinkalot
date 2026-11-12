import { TIMED_OUT_GUESS } from "../daily-games/hooks/useSubmitQuestionGuess";
import type { GameProgressHistory } from "../daily-games/types";

const APP_NAME = "Thinkalot";

const EMOJI = {
  correct: "🟢",
  wrong: "🔴",
  timedOut: "⏱️",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function ordinal(day: number) {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

/**
 * Formats a game date ("2026-11-10") as "Nov 10th". Parsed by hand rather than
 * with `new Date()` so the day can't shift in timezones behind UTC.
 */
export function formatGameDate(date: string) {
  const [, month, day] = date.split("-").map(Number);
  return `${MONTHS[month - 1]} ${ordinal(day)}`;
}

function resultEmoji(round: GameProgressHistory) {
  if (round.isCorrect) return EMOJI.correct;
  if (round.guess === TIMED_OUT_GUESS) return EMOJI.timedOut;
  return EMOJI.wrong;
}

/**
 * Builds the shareable summary, e.g.
 *
 *   Thinkalot · Nov 10th
 *   5 / 8
 *   🟢🟢🔴⏱️🟢🔴🟢🟢
 *   https://thinkalot.example
 */
export function buildShareText({
  date,
  history,
  roundLength,
  url,
}: {
  date: string;
  history: GameProgressHistory[];
  roundLength: number;
  url: string;
}) {
  const correct = history.filter((round) => round.isCorrect).length;

  return [
    `${APP_NAME} · ${formatGameDate(date)}`,
    `${correct} / ${roundLength}`,
    history.map(resultEmoji).join(""),
    url,
  ].join("\n");
}

export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

/**
 * Opens the native share sheet on touch devices, and copies to the clipboard
 * everywhere else (desktop share sheets are clunky for pasting into a chat).
 */
export async function shareText(text: string): Promise<ShareOutcome> {
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (isTouchDevice && navigator.share && navigator.canShare?.({ text })) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch (error) {
      // The user closed the share sheet without picking anything.
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
      // Otherwise fall through and try the clipboard instead.
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
