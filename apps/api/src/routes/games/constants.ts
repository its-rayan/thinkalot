export const GameMode = {
  DUEL: "duel",
  MULTIPLAYER: "multiplayer",
} as const;

export const GameStatus = {
  WAITING: "waiting",
  ACTIVE: "active",
  COMPLETED: "completed",
} as const;

export const MAX_PLAYERS = {
  [GameMode.DUEL]: 2,
  [GameMode.MULTIPLAYER]: 200,
} as const;

export const MAX_GAMES_DATA_LIMIT = 100;
