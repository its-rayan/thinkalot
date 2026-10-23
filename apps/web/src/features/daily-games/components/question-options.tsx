import type { Question } from "../api/questions";

interface QuestionOptions {
  question: Question;
  revealAnswer:
    | {
        isCorrect: boolean;
        correctAnswer: string;
        explanation: string;
        guess: string;
      }
    | undefined;
  onGuess: (questionId: string, guess: string) => void;
}

export default function QuestionOptions({
  question,
  onGuess,
  revealAnswer,
}: QuestionOptions) {
  const optionKeys = Object.keys(
    question.answers,
  ) as (keyof typeof question.answers)[];

  const showAnswer = revealAnswer !== undefined;

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex w-full flex-col gap-3.5">
        {optionKeys.map((optionKey) => {
          const isAnswer =
            showAnswer && optionKey === revealAnswer.correctAnswer;
          const showCorrect = showAnswer && isAnswer;
          const showWrong =
            showAnswer && !isAnswer && optionKey === revealAnswer.guess;
          const faded = showAnswer && !showCorrect && !showWrong;

          let surface = "border-black bg-muted text-black";
          if (showCorrect) surface = "border-black bg-emerald-500 text-white";
          else if (showWrong) surface = "border-black bg-red-500 text-white";
          else if (faded) surface = "border-black/20 bg-cloud/70 text-black/30";

          return (
            <li key={`${question.id}--${optionKey}`}>
              <button
                type="button"
                onClick={() => onGuess(question.id, optionKey)}
                style={{
                  boxShadow: faded
                    ? "0 4px 0 0 rgba(22,24,29,0.15)"
                    : "0 4px 0 0 #16181D",
                }}
                className={`relative flex min-h-[56px] w-full items-center justify-center rounded-xl border-3 px-12 py-3 text-center uppercase leading-tight tracking-[0.03em] transition-[transform,background-color,color] duration-150 ease-out ${surface} cursor-pointer`}
              >
                <span
                  className={`absolute left-4 font-black text-sm ${showCorrect || showWrong ? "text-accent" : faded ? "text-black/20" : "text-muted-foreground"}`}
                  aria-hidden="true"
                >
                  {optionKey}
                </span>
                <span className={`font-poster`}>
                  {question.answers[optionKey]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
