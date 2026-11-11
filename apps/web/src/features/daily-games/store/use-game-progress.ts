import { create } from "zustand";
import type { GameProgressHistory } from "../types";
import { useGameRoundStore } from "./use-game-round";

const LOCAL_STORAGE_KEY = "thinkalot.daily.progress";

export interface GameProgress {
  date: string;
  questionIndex: number;
  isLastQuestion: boolean;
  history: GameProgressHistory[];
  isGameFinished: boolean;
}

export function setDailyProgress(value: GameProgress) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
}

export function clearDailyProgress() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

/**
 * Returns the saved progress for the given date, or null if there is none
 * (or the saved progress belongs to a different day's game).
 */
export function getDailyProgress(date: string): GameProgress | null {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!saved) return null;

  try {
    const progress = JSON.parse(saved) as GameProgress;
    return progress.date === date ? progress : null;
  } catch {
    return null;
  }
}

/** Whether the user has already completed the game for the given date. */
export function hasFinishedGame(date: string) {
  return getDailyProgress(date)?.isGameFinished ?? false;
}

function loadState(date: string) {
  const saved = getDailyProgress(date);
  return {
    date,
    questionIndex: saved?.questionIndex ?? 1,
    isLastQuestion: saved?.isLastQuestion ?? false,
    history: saved?.history ?? [],
    isGameFinished: saved?.isGameFinished ?? false,
  };
}

const roundLength = useGameRoundStore.getState().roundLength;

type GameProgressState = ReturnType<typeof loadState> & {
  roundLength: number;
  updateProgress: (
    questionIndex: number,
    history: GameProgressHistory[],
    isLastQuestion: boolean,
  ) => void;
  initialise: () => void;
  /** Deletes saved progress so the game starts again from the first question. */
  resetProgress: () => void;
};

export const useGameProgressStore = create<GameProgressState>()((set) => ({
  ...loadState(useGameRoundStore.getState().date),
  roundLength,
  initialise: () => set(() => loadState(useGameRoundStore.getState().date)),
  resetProgress: () => {
    clearDailyProgress();
    set(() => loadState(useGameRoundStore.getState().date));
  },
  updateProgress: (questionIndex, history, isLastQuestion) =>
    set((state) => {
      const isGameFinished = questionIndex > state.roundLength;

      setDailyProgress({
        date: state.date,
        questionIndex,
        isLastQuestion,
        history,
        isGameFinished,
      });

      return { questionIndex, history, isLastQuestion, isGameFinished };
    }),
}));
