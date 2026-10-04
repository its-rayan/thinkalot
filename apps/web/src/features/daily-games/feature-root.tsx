import useQuestions from "../daily-games/hooks/useQuestions";

export default function DailyGame() {
  const date = "2026-10-03";
  const { data: questions, isLoading } = useQuestions(date);

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className="max-w-xl h-screen m-auto flex pt-40 justify-center">
      <div className="flex flex-col bg-white items-center space-y-6  rounded-xl p-6 w-full h-125">
        <p className="text-black w-contain">{JSON.stringify(questions)}</p>
      </div>
    </section>
  );
}
