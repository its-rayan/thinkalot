"use client";

import Image from "next/image";
import useFlags from "@/features/flags/hooks/use-flags";

export default function Home() {
  const { currentQuestion, score, onCorrectAnswer } = useFlags();

  const onClick = (option: string) => {
    if (option === currentQuestion.answer) {
      onCorrectAnswer();
    }
  };

  return (
    <div>
      <h2>Guess the country&apos;s flag</h2>
      <p>Score: {score}</p>
      <div>
        <Image
          src={currentQuestion.flagImage}
          alt="Flag"
          width={200}
          height={120}
        />
      </div>
      <div>
        {currentQuestion.options.map((option) => (
          <button key={option} onClick={() => onClick(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
