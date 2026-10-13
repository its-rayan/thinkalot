const surface = "border-black bg-muted text-black";

interface QuestionOptions {
  questionId: string;
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
}: QuestionOptions) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex w-full flex-col gap-3.5">
        {(Object.keys(options) as (keyof typeof options)[]).map((optionKey) => (
          <li key={`${questionId}--${optionKey}`}>
            <button
              type="button"
              style={{
                boxShadow: "0 4px 0 0 #16181D",
              }}
              className={`relative flex min-h-[56px] w-full items-center justify-center rounded-xl border-3 px-12 py-3 text-center uppercase leading-tight tracking-[0.03em] transition-[transform,background-color,color] duration-150 ease-out ${surface} cursor-default`}
            >
              <span
                className={`absolute left-4 font-black text-sm text-muted-foreground`}
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
