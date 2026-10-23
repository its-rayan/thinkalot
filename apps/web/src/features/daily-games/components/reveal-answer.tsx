interface RevealAnswer {
  revealAnswer: {
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    guess: string;
  };
  onClick: () => void;
  isLastQuestion: boolean;
}

const SURFACE: { [key: string]: string } = {
  green: "bg-emerald-500",
  red: "bg-red-500",
  neutral: "bg-indigo-light",
};

export type PosterTone = "pink" | "cyan" | "white" | "yellow" | "green" | "red";

interface PosterButtonProps {
  children: React.ReactNode;
  tone?: PosterTone;
  type?: "button" | "submit";
  size?: "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const BUTTON_SURFACE: Record<PosterTone, string> = {
  pink: "bg-pink text-white",
  cyan: "bg-cyan text-white",
  white: "bg-white text-black",
  yellow: "bg-yellow text-black",
  green: "bg-mint text-white",
  red: "bg-red text-white",
};

/** Light surfaces read best with plain ink type; saturated ones get the outlined poster type. */
const OUTLINED: Record<PosterTone, boolean> = {
  pink: true,
  cyan: true,
  white: false,
  yellow: false,
  green: true,
  red: true,
};

export default function RevealAnswer({
  revealAnswer,
  onClick,
  isLastQuestion,
}: RevealAnswer) {
  const tone = revealAnswer.isCorrect ? "green" : "red";
  const title = revealAnswer.isCorrect ? "Correct" : "Not quite";
  const subtitle = revealAnswer.isCorrect
    ? `Thats correct! The answer was ${revealAnswer.correctAnswer}.`
    : `The answer was ${revealAnswer.correctAnswer}. Streak reset.`;

  const size = "md";
  const edge = 4;
  const disabled = false;
  const fullWidth = false;

  return (
    <div
      className={`mt-8 overflow-hidden rounded-xl border-3 border-black ${SURFACE[tone]}`}
      style={{ boxShadow: "0 5px 0 0 #16181D" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
        <div className="min-w-0">
          <p className="text-poster-xs text-2xl uppercase leading-none text-white">
            {title}
          </p>
          {subtitle && (
            <p className="mt-1.5 text-sm font-semibold text-white/90">
              {subtitle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          style={{ boxShadow: disabled ? "none" : `0 ${edge}px 0 0 #16181D` }}
          className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-3 border-black uppercase leading-none tracking-[0.04em] transition-[transform,box-shadow] duration-100 ease-out ${
            size === "lg"
              ? "px-7 py-3.5 text-[19px]"
              : "px-4 py-2.5 text-[15px]"
          } ${fullWidth ? "w-full" : ""} ${
            disabled
              ? "cursor-not-allowed border-black/40 bg-indigo-light text-white/60"
              : `${BUTTON_SURFACE.white} hover:-translate-y-0.5 active:translate-y-[5px] active:!shadow-none`
          }`}
        >
          <span
            className={`flex items-center gap-2 ${
              !disabled && OUTLINED.white
                ? size === "lg"
                  ? "text-poster-xs"
                  : "text-poster-2xs"
                : "font-poster"
            }`}
          >
            {isLastQuestion ? "Results" : "Next"}
          </span>
        </button>
      </div>
    </div>
  );
}
