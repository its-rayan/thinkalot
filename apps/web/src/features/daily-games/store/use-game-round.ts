import { create } from "zustand";

export type GamePhase = "answering" | "reveal" | "final";

const initialState: {
  date: string;
  roundLength: number;
  gamePhase: GamePhase;
} = { date: "2026-10-03", roundLength: 8, gamePhase: "answering" };

type GameRoundState = typeof initialState & {
  setGamePhase: (gamePhase: GamePhase) => void;
};

export const useGameRoundStore = create<GameRoundState>()((set) => ({
  ...initialState,
  setGamePhase: (gamePhase: GamePhase) => set(() => ({ gamePhase })),
}));
