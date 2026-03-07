"use client";

import Image from "next/image";
import useFlags from "@/features/flags/hooks/use-flags";

export default function Home() {
  const { currentQuestion, score, isComplete, onAnswer, onPlayAgain } = useFlags();

  if (isComplete) {
    return (
      <div>
        <h2>Completed!</h2>
        <p>Final score: {score}</p>
        <button onClick={onPlayAgain}>Play Again</button>
      </div>
    );
  }

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
          <button key={option} onClick={() => onAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
