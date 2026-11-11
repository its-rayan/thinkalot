import useQuestionTimer from "../hooks/useQuestionTimer";

/** Below this many milliseconds the bar turns red to signal urgency. */
const WARNING_MS = 3000;

interface QuestionTimer {
  duration: number;
  isRunning: boolean;
  onExpire: () => void;
}

export default function QuestionTimer({
  duration,
  isRunning,
  onExpire,
}: QuestionTimer) {
  const { remaining, progress } = useQuestionTimer({
    duration,
    isRunning,
    onExpire,
  });

  const isWarning = remaining <= WARNING_MS;

  return (
    <div className="flex items-center gap-4">
      <div
        role="progressbar"
        aria-label="Time remaining"
        aria-valuemin={0}
        aria-valuemax={duration / 1000}
        aria-valuenow={Math.ceil(remaining / 1000)}
        className="h-3 flex-1 overflow-hidden rounded-full bg-black/10"
      >
        <div
          className={`h-full rounded-full transition-[width,background-color] duration-100 ease-linear ${
            isWarning ? "bg-red-500" : "bg-cyan-500"
          }`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span
        aria-hidden="true"
        className={`w-10 text-right font-poster text-xl leading-none tabular-nums ${
          isWarning ? "text-red-500" : "text-black"
        }`}
      >
        {(remaining / 1000).toFixed(1)}
      </span>
    </div>
  );
}
