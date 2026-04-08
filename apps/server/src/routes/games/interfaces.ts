import { GameMode as GameModeConst } from "@routes/games/constants";

export type GameStatus = "waiting" | "active" | "completed";
export type GameModeType = (typeof GameModeConst)[keyof typeof GameModeConst];

export interface Game {
  id: number;
  status: GameStatus;
  mode: GameModeType;
  players: string[];
  maxPlayers: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  winnerId?: number;
}
