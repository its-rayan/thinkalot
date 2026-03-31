CREATE TABLE "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'open',
	"mode" text DEFAULT 'multiplayer',
	"players" text[] DEFAULT '{}' NOT NULL,
	"max_players" integer DEFAULT 200 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
