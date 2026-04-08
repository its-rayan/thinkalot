import * as z from "zod";
import { GameMode } from "@routes/games/constants";

export const createGameSchema = z.object({
  mode: z.enum([GameMode.DUEL, GameMode.MULTIPLAYER]),
  players: z.array(z.string()).max(200).default([]),
});
