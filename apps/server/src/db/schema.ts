import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  status: text("status", {
    enum: ["waiting", "in_progress", "finished"],
  }).default("waiting"),
  players: text("players").array().default([]).notNull(),
  max_players: integer("max_players").default(2).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
