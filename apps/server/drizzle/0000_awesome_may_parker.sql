CREATE TABLE "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'waiting',
	"players" text[] DEFAULT '{}' NOT NULL,
	"max_players" integer DEFAULT 2 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
