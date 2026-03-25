"use client";

import useQuestionTimer from "@/features/room/hooks/use-question-timer";

export default function QuestionTimer() {
  const { timer } = useQuestionTimer();

  return (
    <div className="w-full flex justify-center ">
      <div className="relative h-22 w-22">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            className={timer > 10 ? "stroke-green-500/20" : "stroke-red-500/20"}
            strokeWidth="1"
          />
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            className={timer > 10 ? "stroke-green-500" : "stroke-red-500"}
            strokeWidth="1"
            strokeDasharray="100"
            strokeDashoffset={100 - (timer / 30) * 100}
            strokeLinecap="round"
          />
        </svg>
        <p
          className={`absolute left-1/2 top-1/2 w-20 h-20 flex items-center justify-center text-lg font-semibold rounded-full ${timer > 10 ? "bg-green-500/10 text-green-500" : "bg-red-800/10 text-red-500"} `}
          style={{ transform: "translate(-50%, -50%)" }}
        >
          00:{timer.toString().padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
