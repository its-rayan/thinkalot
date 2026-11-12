import { create } from "zustand";
import { getTodayGameDate } from "../utils/game-date";

export type GamePhase = "answering" | "reveal" | "final";

const initialState: {
  date: string;
  roundLength: number;
  gamePhase: GamePhase;
} = { date: getTodayGameDate(), roundLength: 8, gamePhase: "answering" };

type GameRoundState = typeof initialState & {
  setGamePhase: (gamePhase: GamePhase) => void;
  /**
   * Moves the game on to today's date if the day has changed since the app
   * loaded (e.g. a tab left open overnight). Returns true if it changed.
   */
  syncToToday: () => boolean;
};

export const useGameRoundStore = create<GameRoundState>()((set, get) => ({
  ...initialState,
  setGamePhase: (gamePhase: GamePhase) => set(() => ({ gamePhase })),
  syncToToday: () => {
    const today = getTodayGameDate();
    if (get().date === today) return false;
    set(() => ({ date: today, gamePhase: "answering" }));
    return true;
  },
}));
