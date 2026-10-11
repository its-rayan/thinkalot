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

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-rays pointer-events-none absolute inset-x-0 -top-40 h-[760px]"
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-5 py-5">
        <RoundHeader />
        <QuestionContainer prompt={data.question}>
          <QuestionOptions questionId={data.id} options={data.answers} />
        </QuestionContainer>
      </main>
    </div>
  );
}
