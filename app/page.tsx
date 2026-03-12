"use client";

import Image from "next/image";
import useFlags from "@/features/flags/hooks/use-flags";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { currentQuestion, score, isComplete, onAnswer, onPlayAgain } =
    useFlags();

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
          src={currentQuestion.prompt}
          alt="Flag"
          width={200}
          height={120}
        />
      </div>
      <div className="flex gap-2 mt-4">
        {currentQuestion.options.map((option) => (
          <Button
            variant="secondary"
            size="sm"
            key={option}
            onClick={() => onAnswer(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
