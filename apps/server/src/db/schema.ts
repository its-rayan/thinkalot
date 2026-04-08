import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  status: text("status", {
    enum: ["waiting", "active", "completed"],
  }).default("waiting"),
  mode: text("mode", {
    enum: ["duel", "multiplayer"],
  }).default("duel"),
  players: text("players").array().default([]).notNull(),
  maxPlayers: integer("max_players").default(2).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  winnerId: integer("winner_id"),
});
