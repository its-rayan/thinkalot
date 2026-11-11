import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { postQuestionGuess, type QuestionGuessPayload } from "../api/questions";
import { useGameRoundStore } from "../store/use-game-round";

/** Guess submitted when the timer runs out before the player answers. */
export const TIMED_OUT_GUESS = "";

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
    // Clear the previous question's answer so it isn't shown while this
    // guess is being checked.
    setRevealAnswer(undefined);
    mutation.mutate(
      {
        questionId,
        // A timed-out question has no guess, so leave it out of the request.
        guess: guess === TIMED_OUT_GUESS ? undefined : guess,
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
    isGuessError: mutation.isError,
    /** Re-sends the last guess after a failed request. */
    retryGuess: () => {
      if (mutation.variables) {
        const { questionId, guess } = mutation.variables;
        onGuess(questionId, guess ?? TIMED_OUT_GUESS);
      }
    },
  };
}
