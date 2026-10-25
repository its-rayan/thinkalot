import { create } from "zustand";
import type { GameProgressHistory } from "../types";

const LOCAL_STORAGE_KEY = "thinkalot.daily.progress";

export interface GameProgress {
  date: string;
  questionIndex: number;
  isLastQuestion: boolean;
  history: GameProgressHistory[];
}

export function setDailyProgress(value: GameProgress) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
}

export function getDailyProgress() {
  return localStorage.getItem(LOCAL_STORAGE_KEY);
}

type Progress = {
  date: string;
  questionIndex: number;
  isLastQuestion: boolean;
  roundLength: number;
  history: GameProgressHistory[];
};

const initialState: {
  date: string;
  questionIndex: number;
  isLastQuestion: boolean;
  roundLength: number;
  history: GameProgressHistory[];
} = {
  date: "2026-10-03",
  questionIndex: 1,
  isLastQuestion: false,
  roundLength: 8,
  history: [],
};

type GameProgressState = typeof initialState & {
  updateProgress: (
    questionIndex: number,
    history: GameProgressHistory[],
    isLastQuestion: boolean,
  ) => void;
  initialise: () => void;
};

export const useGameProgressStore = create<GameProgressState>()((set) => ({
  ...initialState,
  initialise: () =>
    set((state) => {
      const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress) as Progress;
        return { ...state, ...progress };
      }
      return state;
    }),
  updateProgress: (questionIndex, history, isLastQuestion) =>
    set((state) => {
      const newState = { ...state, questionIndex, history, isLastQuestion };

      // save progress to localstorage
      setDailyProgress({
        date: newState.date,
        questionIndex: newState.questionIndex,
        isLastQuestion: newState.isLastQuestion,
        history: newState.history,
      });

      return newState;
    }),
}));
