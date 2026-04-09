import { GameMode, GameStatus } from "@routes/games/constants";
import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  check,
} from "drizzle-orm/pg-core";

export const games = pgTable(
  "games",
  {
    id: serial("id").primaryKey(),
    status: text("status", {
      enum: [GameStatus.WAITING, GameStatus.ACTIVE, GameStatus.COMPLETED],
    }).default(GameStatus.WAITING),
    mode: text("mode", {
      enum: [GameMode.DUEL, GameMode.MULTIPLAYER],
    }).default(GameMode.DUEL),
    players: text("players").array().default([]).notNull(),
    maxPlayers: integer("max_players").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    winnerId: integer("winner_id"),
  },
  (table) => [
    check(
      "max_players_check",
      sql`(${table.mode} = 'duel' AND ${table.maxPlayers} = 2) OR (${table.mode} = 'multiplayer' AND ${table.maxPlayers} = 200)`,
    ),
  ],
);
