import { useState } from "react";
import type { Question } from "../api/questions";

interface GameProgressResult extends Question {
  guess: string;
}

interface GameProgress {
  date: string;
  questionIndex: number;
  result: GameProgressResult[];
}

const LOCAL_STORAGE_KEY = "thinkalot.daily.progress";

export function setDailyProgress(value: GameProgress) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
}

export function getDailyProgress() {
  return localStorage.getItem(LOCAL_STORAGE_KEY);
}

export default function useGameProgress(date: string) {
  const dailyProgress = getDailyProgress();
  const roundLength = 8;
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(
    dailyProgress === null
      ? 1
      : (JSON.parse(dailyProgress) as GameProgress).questionIndex + 1,
  );

  const progressRound = (round: GameProgressResult) => {
    if (questionIndex + 1 > roundLength) {
      setIsGameCompleted(true);
    } else {
      const result =
        dailyProgress === null
          ? [round]
          : [...(JSON.parse(dailyProgress) as GameProgress).result, round];
      setDailyProgress({
        date,
        questionIndex,
        result,
      });
      setQuestionIndex((prev) => prev + 1);
    }
  };

  return {
    questionIndex,
    roundLength,
    progressRound,
    isGameCompleted,
  };
}
