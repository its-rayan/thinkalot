import * as z from "zod";

export const ROOM_OCCUPANCY_STATUS = {
  EMPTY: "empty",
  PARTIALLY_OCCUPIED: "partially_occupied",
  FULL: "full",
} as const;

export const ROOM_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  CLOSED: "closed",
} as const;

const ROOM_GAME_MODE = {
  DUEL: "duel",
  MULTIPLAYER: "multiplayer",
} as const;

export const createRoomSchema = z.object({
  mode: z.enum(Object.values(ROOM_GAME_MODE)),
  players: z.array(z.string()).max(200).default([]),
});
