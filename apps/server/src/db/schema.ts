import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  status: text("status", {
    enum: ["open", "in_progress", "closed"],
  }).default("open"),
  mode: text("mode", {
    enum: ["duel", "multiplayer"],
  }).default("multiplayer"),
  players: text("players").array().default([]).notNull(),
  maxPlayers: integer("max_players").default(200).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
