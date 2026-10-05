import { Button } from "@thinkalot/ui/components/button";
import useQuestions from "../daily-games/hooks/useQuestions";
import QuestionContainer from "./components/question-container";

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

  return (
    <section className="max-w-5xl m-auto flex p-5 gap-8">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-8 flex-1">
        <section className="rounded-xl bg-white border-3 border-black px-7 pb-6 pt-8 text-black">
          <h1 className="mt-5 text-3xl font-extrabold leading-[1.28] tracking-[-0.01em]">
            {data.question}
          </h1>

          <ul className="flex w-full flex-col gap-4 mt-6">
            {Object.keys(data.answers).map((answerKey) => (
              <li key={`${data.id}`}>
                <button
                  type="button"
                  className="w-full py-3 border-3 border-black rounded-xl bg-muted min-h-14"
                >
                  {data.answers[answerKey]}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <aside className="bg-yellow-50">
          <h2>Your Run</h2>
          <div className="bg-yellow-50 "></div>
        </aside>
      </div>
    </section>
  );
}
