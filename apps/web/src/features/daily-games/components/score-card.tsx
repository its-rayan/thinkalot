import type { GameProgress } from "../hooks/useGameProgress";

// const history = [
//   { kind: "correct", pickedIndex: 0, points: 188, buzzMs: 1200 },
//   { kind: "nobuzz", pickedIndex: null, points: 0, buzzMs: null },
//   { kind: "correct", pickedIndex: 0, points: 176, buzzMs: 2400 },
//   { kind: "wrong", pickedIndex: 1, points: -50, buzzMs: 1900 },
// ];

const DOT: Record<string, string> = {
  correct: "bg-emerald-500",
  wrong: "bg-red-500",
  timeout: "bg-red-400",
  nobuzz: "bg-indigo-800",
};

interface ScoreCard {
  dailyProgress: GameProgress | null;
  gameLength: number;
  questionIndex: number;
}

export default function ScoreCard({
  dailyProgress,
  gameLength,
  questionIndex,
}: ScoreCard) {
  const progress = dailyProgress ? dailyProgress.history : [];

  const history = progress.map((h) => ({
    id: h.id,
    kind: h.isCorrect ? "correct" : "wrong",
    pickedIndex: 0,
    points: 188,
    buzzMs: 1200,
  }));

  const currentIndex = questionIndex - 1;

  const correct = history.filter((h) => h.kind === "correct").length;

  return (
    <aside aria-label="Your run" className="flex flex-col gap-4">
      <div
        className="rounded-xl border-3 border-black bg-indigo-500 p-4"
        style={{ boxShadow: "0 4px 0 0 #16181D" }}
      >
        <div className="flex items-baseline justify-between">
          <span className="font-poster text-sm uppercase text-indigo-200">
            Correct
          </span>
          <span className="text-poster-2xs text-[22px] leading-none text-white">
            {correct}/{gameLength}
          </span>
        </div>
        <ol className="mt-3 grid grid-cols-5 gap-2" aria-label="Question track">
          {Array.from({ length: gameLength }).map((_, index) => {
            const done = history[index];
            const current = index === currentIndex && !done;
            return (
              <li
                key={`quest--${done?.id || index}`}
                aria-label={`Question ${current}: ${done ? done.kind : current ? "current" : "upcoming"}`}
                className={`grid h-9 place-items-center rounded-lg border-[2.5px] font-poster text-sm leading-none ${
                  done
                    ? `${DOT[done.kind]} border-black text-white`
                    : current
                      ? "border-black bg-yellow-500 text-black"
                      : "border-indigo-400 text-indigo-400"
                }`}
              >
                {index + 1}
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
