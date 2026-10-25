import { useEffect, useState } from "react";
import type { Question } from "../api/questions";
import { useGameProgressStore } from "../store/use-game-progress";
import { useGameRoundStore } from "../store/use-game-round";
import type { GameProgressHistory } from "../types";

interface GameProgressResult extends Question {
  guess: string;
  isCorrect: boolean;
}

export interface GameProgress {
  date: string;
  questionIndex: number;
  isLastQuestion: boolean;
  roundLength: number;
  history: GameProgressHistory[];
}

export type GamePhase = "answering" | "reveal" | "final";

const LOCAL_STORAGE_KEY = "thinkalot.daily.progress";

export default function useGameProgress() {
  const { roundLength, setGamePhase } = useGameRoundStore();
  const { questionIndex, updateProgress, initialise } = useGameProgressStore();
  const dailyProgress = localStorage.getItem(LOCAL_STORAGE_KEY);

  useEffect(() => {
    initialise();
  }, [initialise]);

  const progressRound = (round: GameProgressResult) => {
    setGamePhase("reveal");
    if (questionIndex + 1 <= roundLength) {
      const history =
        dailyProgress === null
          ? [round]
          : [...(JSON.parse(dailyProgress) as GameProgress).history, round];

      const isLastQuestion = questionIndex + 1 === roundLength;
      updateProgress(questionIndex + 1, history, isLastQuestion);
    }
  };

  return {
    questionIndex,
    progressRound,
  };
}
