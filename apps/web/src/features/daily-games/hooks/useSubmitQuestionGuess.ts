import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  checkGuess,
  type fetchQuestionsByDate,
  questionKeys,
} from "../api/questions";
import { useGameRoundStore } from "../store/use-game-round";

/** Guess submitted when the timer runs out before the player answers. */
export const TIMED_OUT_GUESS = "";

export interface RevealAnswer {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  guess: string;
}

type QuestionsResult = Awaited<ReturnType<typeof fetchQuestionsByDate>>;

export default function useSubmitQuestionGuess() {
  const { date } = useGameRoundStore();
  const queryClient = useQueryClient();
  const [revealAnswer, setRevealAnswer] = useState<RevealAnswer | undefined>(
    undefined,
  );

  const onGuess = (questionId: string, guess: string) => {
    // The question being answered was loaded by useQuestions, so the day's
    // questions are already in the cache.
    const questions =
      queryClient.getQueryData<QuestionsResult>(questionKeys.byDate(date))
        ?.data ?? [];

    const result = checkGuess(questions, {
      questionId,
      // A timed-out question has no guess.
      guess: guess === TIMED_OUT_GUESS ? undefined : guess,
    });

    setRevealAnswer({ ...result, guess });
  };

  return { onGuess, revealAnswer };
}
