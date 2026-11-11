import { useEffect, useRef, useState } from "react";

const TICK_MS = 100;

interface Args {
  /** Total time allowed, in milliseconds. */
  duration: number;
  /** Whether the clock is counting down. When false the timer freezes. */
  isRunning: boolean;
  /** Called once when the timer reaches zero. */
  onExpire: () => void;
}

/**
 * Countdown for a single question. Remount the consuming component
 * (e.g. with `key={question.id}`) to restart it for the next question.
 */
export default function useQuestionTimer({
  duration,
  isRunning,
  onExpire,
}: Args) {
  const [remaining, setRemaining] = useState(duration);
  const remainingRef = useRef(duration);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!isRunning || remainingRef.current === 0) return;

    // Measure against wall-clock time so the countdown stays accurate even if
    // ticks are delayed (e.g. a backgrounded tab).
    const startedAt = Date.now();
    const startRemaining = remainingRef.current;

    const id = setInterval(() => {
      const next = Math.max(0, startRemaining - (Date.now() - startedAt));
      remainingRef.current = next;
      setRemaining(next);

      if (next === 0) {
        clearInterval(id);
        onExpireRef.current();
      }
    }, TICK_MS);

    return () => clearInterval(id);
  }, [isRunning]);

  return {
    remaining,
    /** Fraction of time left, from 1 (full) to 0 (expired). */
    progress: remaining / duration,
  };
}
