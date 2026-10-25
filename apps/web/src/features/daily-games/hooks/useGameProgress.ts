import { useState } from "react";
import type { Question } from "../api/questions";

interface GameProgressResult extends Question {
  guess: string;
  isCorrect: boolean;
}

export interface GameProgress {
  date: string;
  questionIndex: number;
  result: GameProgressResult[];
}

export type GamePhase = "answering" | "reveal" | "final";

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
  const [gamePhase, setGamePhase] = useState<GamePhase>("answering");
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(
    dailyProgress === null
      ? 1
      : (JSON.parse(dailyProgress) as GameProgress).questionIndex + 1,
  );

  const progressRound = (round: GameProgressResult) => {
    setGamePhase("reveal");
    if (questionIndex + 1 === roundLength) {
      setIsLastQuestion(true);
    }

    if (questionIndex + 1 <= roundLength) {
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
    isLastQuestion,
    gamePhase,
    setGamePhase,
    dailyProgress: dailyProgress
      ? (JSON.parse(dailyProgress) as GameProgress)
      : null,
  };
}
