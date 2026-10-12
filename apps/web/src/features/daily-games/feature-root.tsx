import useQuestions from "../daily-games/hooks/useQuestions";
import QuestionContainer from "./components/question-container";
import QuestionOptions from "./components/question-options";
import RoundHeader from "./components/round-header";

export default function DailyGame() {
  const date = "2026-10-03";
  const { data: questions, isLoading } = useQuestions(date);

  if (isLoading) return <div>Loading...</div>;

  console.log("questions: ", questions);

  const data = {
    id: "2026-10-03-q1",
    question: "Which planet is the largest in our solar system?",
    answers: {
      A: "Earth",
      B: "Jupiter",
      C: "Saturn",
      D: "Neptune",
    },
    category: "Science",
    difficulty: "Easy",
  };

  const history = [
    { kind: "correct", pickedIndex: 0, points: 188, buzzMs: 1200 },
    { kind: "nobuzz", pickedIndex: null, points: 0, buzzMs: null },
    { kind: "correct", pickedIndex: 0, points: 176, buzzMs: 2400 },
    { kind: "wrong", pickedIndex: 1, points: -50, buzzMs: 1900 },
  ];

  const DOT: Record<string, string> = {
    correct: "bg-green-500",
    wrong: "bg-red-500",
    timeout: "bg-red-400",
    nobuzz: "bg-indigo-800",
  };

  const currentIndex = 2;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-rays pointer-events-none absolute inset-x-0 -top-40 h-[760px]"
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-5 py-5">
        <RoundHeader />
        <div className="grid flex-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <QuestionContainer prompt={data.question}>
            <QuestionOptions questionId={data.id} options={data.answers} />
          </QuestionContainer>

          <aside aria-label="Your run" className="flex flex-col gap-4">
            <div
              className="rounded-xl border-3 border-black bg-indigo-500 p-4"
              style={{ boxShadow: "0 4px 0 0 #16181D" }}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-poster text-sm uppercase text-indigo-200">
                  Correct
                </span>
                <span className="text-poster-2xs text-[22px] leading-none text-white">
                  2/10
                </span>
              </div>
              <ol
                className="mt-3 grid grid-cols-5 gap-2"
                aria-label="Question track"
              >
                {Array.from({ length: 10 }).map((_, index) => {
                  const done = history[index];
                  const current = index === currentIndex && !done;
                  return (
                    <li
                      key={`quest--${history[index]}`}
                      aria-label={`Question ${index + 1}: ${done ? done.kind : current ? "current" : "upcoming"}`}
                      className={`grid h-9 place-items-center rounded-lg border-[2.5px] text-poster text-sm leading-none ${
                        done
                          ? `${DOT[done.kind]} border-black text-white`
                          : current
                            ? "border-black bg-yellow text-black"
                            : "border-red text-white/50"
                      }`}
                    >
                      {index + 1}
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
