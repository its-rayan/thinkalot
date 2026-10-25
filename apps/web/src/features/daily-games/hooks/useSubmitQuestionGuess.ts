import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { postQuestionGuess, type QuestionGuessPayload } from "../api/questions";
import { useGameRoundStore } from "../store/use-game-round";

export interface RevealAnswer {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  guess: string;
}

export default function useSubmitQuestionGuess() {
  const { date } = useGameRoundStore();
  const [revealAnswer, setRevealAnswer] = useState<RevealAnswer | undefined>(
    undefined,
  );

  const mutation = useMutation({
    mutationFn: (payload: QuestionGuessPayload) =>
      postQuestionGuess(date, payload),
  });

  const onGuess = (questionId: string, guess: string) => {
    mutation.mutate(
      {
        questionId: questionId,
        guess,
      },
      {
        onSuccess: (data) => {
          setRevealAnswer(() => ({ ...data.data, guess }));
        },
      },
    );
  };

  return {
    onGuess,
    revealAnswer,
  };
}
