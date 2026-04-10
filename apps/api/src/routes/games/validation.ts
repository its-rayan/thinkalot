import * as z from "zod";
import { GameMode, MAX_GAMES_DATA_LIMIT } from "@routes/games/constants";

export const createGameSchema = z.object({
  mode: z.enum([GameMode.DUEL, GameMode.MULTIPLAYER]),
  players: z.array(z.string()).max(200).default([]),
});

export const getGamesSchema = z.object({
  status: z.enum(["waiting", "active", "completed"]).optional(),
  mode: z.enum([GameMode.DUEL, GameMode.MULTIPLAYER]).optional(),
  limit: z.number().int().positive().max(MAX_GAMES_DATA_LIMIT).optional(),
});
