import * as z from "zod";

export const ROOM_OCCUPANCY_STATUS = {
  EMPTY: "empty",
  PARTIALLY_OCCUPIED: "partially_occupied",
  FULL: "full",
} as const;

export const ROOM_STATUS = {
  OPEN: "open",
  CLOSED: "closed",
} as const;
