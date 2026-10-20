interface QuestionOptions {
  isAnswering: boolean;
  isCorrect: boolean | undefined;
  questionId: string;
  onClick: (optionKey: string) => void;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export default function QuestionOptions({
  questionId,
  options,
  onClick,
  isAnswering,
  isCorrect,
}: QuestionOptions) {
  const showCorrect = isCorrect && !isAnswering;
  const showWrong = !isCorrect && !isAnswering;

  let surface = "border-black bg-muted text-black";
  if (showCorrect) surface = "border-black bg-emerald-500 text-white";
  else if (showWrong) surface = "border-black bg-red-500 text-white";

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex w-full flex-col gap-3.5">
        {(Object.keys(options) as (keyof typeof options)[]).map((optionKey) => (
          <li key={`${questionId}--${optionKey}`}>
            <button
              type="button"
              onClick={() => onClick(optionKey)}
              style={{
                boxShadow: "0 4px 0 0 #16181D",
              }}
              className={`relative flex min-h-[56px] w-full items-center justify-center rounded-xl border-3 px-12 py-3 text-center uppercase leading-tight tracking-[0.03em] transition-[transform,background-color,color] duration-150 ease-out ${surface} cursor-pointer`}
            >
              <span
                className={`absolute left-4 font-black text-sm ${showCorrect || showWrong ? "text-accent" : "text-muted-foreground"}`}
                aria-hidden="true"
              >
                {optionKey}
              </span>
              <span className={`font-poster`}>{options[optionKey]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
