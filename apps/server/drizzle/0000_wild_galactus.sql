CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'waiting',
	"mode" text DEFAULT 'duel',
	"players" text[] DEFAULT '{}' NOT NULL,
	"max_players" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"winner_id" integer,
	CONSTRAINT "max_players_check" CHECK (("games"."mode" = 'duel' AND "games"."max_players" = 2) OR ("games"."mode" = 'multiplayer' AND "games"."max_players" = 200))
);
