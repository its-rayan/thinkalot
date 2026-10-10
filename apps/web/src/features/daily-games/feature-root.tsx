import useQuestions from "../daily-games/hooks/useQuestions";
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

  const surface = "border-black bg-muted text-black";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-rays pointer-events-none absolute inset-x-0 -top-40 h-[760px]"
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-5 py-5">
        <RoundHeader />

        <div className="grid flex-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex flex-col gap-7">
            <section
              className="relative rounded-2xl border-3 border-black bg-white px-5 pb-6 pt-8 text-black sm:px-7"
              style={{ boxShadow: "0 6px 0 0 #16181D" }}
            >
              <h1 className="mt-5 text-2xl font-black leading-[1.28] tracking-[-0.01em] sm:text-[30px]">
                Which planet is the largest in our solar system?
              </h1>

              <div className="mt-6">
                <div className="flex flex-col gap-4">
                  <ul className="flex w-full flex-col gap-3.5">
                    {(
                      Object.keys(data.answers) as (keyof typeof data.answers)[]
                    ).map((answerKey) => (
                      <li key={`${data.id}`}>
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
                            {answerKey}
                          </span>
                          <span className={`font-black`}>
                            {data.answers[answerKey]}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

//   return (
//     <section className="max-w-5xl m-auto flex p-5 gap-8">
//       <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-8 flex-1">
//         <section className="rounded-xl bg-white border-3 border-black px-7 pb-6 pt-8 text-black">
//           <h1 className="mt-5 text-3xl font-extrabold leading-[1.28] tracking-[-0.01em]">
//             {data.question}
//           </h1>

//           <ul className="flex w-full flex-col gap-4 mt-6">
//             {(Object.keys(data.answers) as (keyof typeof data.answers)[]).map(
//               (answerKey) => (
//                 <li key={`${data.id}`}>
//                   <button
//                     type="button"
//                     className="w-full py-3 border-3 border-black rounded-xl bg-muted min-h-14"
//                   >
//                     {data.answers[answerKey]}
//                   </button>
//                 </li>
//               ),
//             )}
//           </ul>
//         </section>

//         <aside className="bg-yellow-50">
//           <h2>Your Run</h2>
//           <div className="bg-yellow-50 "></div>
//         </aside>
//       </div>
//     </section>
//   );
// }
