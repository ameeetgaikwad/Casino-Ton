DO $$ BEGIN
 CREATE TYPE "public"."COIN" AS ENUM('HEAD', 'TAIL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."GAME_TYPE" AS ENUM('COIN', 'ROULETTE', 'LOTTERY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flip" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" varchar(36) NOT NULL,
	"player" varchar(255) NOT NULL,
	"amount_bet" integer NOT NULL,
	"guess" integer NOT NULL,
	"winner" boolean,
	"total_payout" integer,
	"total_profit" integer,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "flip_game_id_unique" UNIQUE("game_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player" text NOT NULL,
	"transaction" text NOT NULL,
	"outcome" text,
	"wager" double precision NOT NULL,
	"payout" double precision NOT NULL,
	"profit" double precision NOT NULL,
	"is_win" boolean,
	"game_type" "GAME_TYPE",
	"created_at" timestamp DEFAULT now()
);
