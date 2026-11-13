import { Share08Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  type GameProgress,
  getDailyProgress,
} from "../daily-games/store/use-game-progress";
import { useGameRoundStore } from "../daily-games/store/use-game-round";
import { isValidGameDate } from "../daily-games/utils/game-date";
import NoResult from "./components/no-result";
import { buildShareText, type ShareOutcome, shareText } from "./share-score";

/** How long the "Copied!" confirmation stays on the button. */
const SHARE_FEEDBACK_MS = 2000;

const DOT = {
  correct: "bg-emerald-500",
  wrong: "bg-red-500",
  timeout: "bg-red",
  nobuzz: "bg-cloud",
};

export default function Results() {
  const { date } = useParams({ from: "/results/$date" });
  const { date: todayDate, roundLength } = useGameRoundStore();

  if (!isValidGameDate(date)) return <NoResult reason="invalid-date" />;

  // Read the saved game for the date in the URL, which isn't necessarily
  // today's game.
  const progress = getDailyProgress(date);

  if (!progress?.isGameFinished) {
    const isToday = date === todayDate;
    return (
      <NoResult
        date={date}
        reason={
          isToday && progress
            ? "in-progress"
            : isToday
              ? "not-played-today"
              : "not-played"
        }
      />
    );
  }

  return (
    <ResultSummary date={date} progress={progress} roundLength={roundLength} />
  );
}

interface ResultSummary {
  date: string;
  progress: GameProgress;
  roundLength: number;
}

function ResultSummary({ date, progress, roundLength }: ResultSummary) {
  const { history } = progress;
  const correct = history.filter((h) => h.isCorrect).length;

  const [shareOutcome, setShareOutcome] = useState<ShareOutcome | null>(null);
  const text = buildShareText({
    date,
    history,
    roundLength,
    url: window.location.origin,
  });

  // Reset the button label after showing "Copied!".
  useEffect(() => {
    if (shareOutcome !== "copied") return;
    const id = setTimeout(() => setShareOutcome(null), SHARE_FEEDBACK_MS);
    return () => clearTimeout(id);
  }, [shareOutcome]);

  const onShare = async () => {
    setShareOutcome(await shareText(text));
  };

  const isCopied = shareOutcome === "copied";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-rays pointer-events-none absolute inset-x-0 -top-40 h-[620px]"
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col gap-8 px-5 py-10 pt-25">
        <header className="flex flex-col items-center text-center">
          <p className="font-poster text-[16px] uppercase tracking-[0.06em] text-white/80">
            Game complete
          </p>
          <h1 className="text-poster-sm mt-2 text-[46px] uppercase leading-none text-white">
            Not bad!
          </h1>
        </header>

        <section
          className="rounded-2xl border-3 border-black bg-white px-5 pb-5 pt-6 text-black"
          style={{ boxShadow: "0 6px 0 0 #16181D" }}
        >
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-poster text-[44px] leading-none tabular-nums">
              {correct}
            </span>
            <span className="font-poster text-[20px] leading-none text-black/40">
              / {roundLength}
            </span>
          </div>

          <ol
            className="mt-3 flex flex-wrap justify-center gap-1.5"
            aria-label={`${correct} of ${roundLength} correct`}
          >
            {history.map((h, i) => (
              <li
                key={h.id}
                className={`h-4 w-4 rounded-full border-2 border-black ${h.isCorrect ? DOT.correct : DOT.wrong}`}
                title={`Q${i + 1} · ${h.isCorrect ? "Correct" : "Wrong"}`}
              />
            ))}
          </ol>

          <ul className="mt-5 flex flex-col gap-2">
            {history.map((h, i) => {
              return (
                <li
                  key={h.id}
                  className="relative flex h-8 items-center overflow-hidden rounded-lg border-[2.5px] border-black bg-cloud"
                >
                  <span
                    className={`absolute inset-y-0 left-0 ${h.isCorrect ? DOT.correct : DOT.wrong} w-full`}
                  />

                  <span
                    className={`relative w-10 pl-2.5 font-poster text-[14px] leading-none text-white`}
                  >
                    Q{i + 1}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-5">
            <button
              type="button"
              onClick={onShare}
              className={`
                flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-3 border-black uppercase leading-none tracking-[0.04em] 
                px-7 py-3.5 text-[19px]
                ${isCopied ? "bg-emerald-500" : "bg-cyan-500"} text-white transition-colors hover:-translate-y-0.5 active:translate-y-[5px] active:!shadow-none
                w-full
            `}
              style={{ boxShadow: `0 5px 0 0 #16181D` }}
            >
              <span className={`flex items-center gap-2 font-poster`}>
                <HugeiconsIcon icon={isCopied ? Tick02Icon : Share08Icon} />
                {isCopied ? "Copied!" : "Share Score"}
              </span>
            </button>

            {/* Announces the result of copying to screen readers. */}
            <p className="sr-only" aria-live="polite">
              {isCopied ? "Score copied to clipboard" : ""}
            </p>

            {shareOutcome === "failed" && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-black/70">
                  Couldn't copy automatically. Select and copy your score:
                </p>
                <textarea
                  readOnly
                  aria-label="Your score to share"
                  value={text}
                  rows={text.split("\n").length}
                  onFocus={(event) => event.currentTarget.select()}
                  className="mt-2 w-full resize-none rounded-lg border-[2.5px] border-black bg-black/5 p-3 font-mono text-sm"
                />
              </div>
            )}
          </div>
        </section>

        {/* <div className="flex flex-col gap-3 items-center">
          <button
            type="button"
            className={`
                flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-3 border-black uppercase leading-none tracking-[0.04em] 
                px-7 py-3.5 text-[19px]
                bg-pink-500 hover:-translate-y-0.5 active:translate-y-[5px] active:!shadow-none
                w-full
            `}
            style={{ boxShadow: `0 5px 0 0 #16181D` }}
          >
            <span className={`flex items-center gap-2 font-poster`}>
              <HugeiconsIcon icon={Rotate01Icon} size={16} strokeWidth={3} />
              Play again
            </span>
          </button>
        </div> */}
      </main>
    </div>
  );
}
