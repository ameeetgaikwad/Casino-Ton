DO $$ BEGIN
 CREATE TYPE "LOTTERY_STATUS" AS ENUM('Active', 'Pending', 'Closed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "COIN" AS ENUM('HEAD', 'TAIL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "GAME_TYPE" AS ENUM('COIN', 'ROULETTE', 'LOTTERY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tbl_games" (
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
	CONSTRAINT "tbl_games_game_id_unique" UNIQUE("game_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tbl_lotteries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "LOTTERY_STATUS",
	"winning_wallet_address" text,
	"count" integer DEFAULT 0,
	"total_tickets" integer,
	"prize_size" integer,
	"winning_ticket_id" integer,
	"created_at" timestamp DEFAULT now(),
	"start_date" timestamp,
	"end_date" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tbl_tickets" (
	"ticket_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lottery_id" integer NOT NULL,
	"wallet_address" text NOT NULL,
	"purchase_date" timestamp,
	"winner" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tbl_transaction_history" (
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tbl_tickets" ADD CONSTRAINT "tbl_tickets_lottery_id_tbl_lotteries_id_fk" FOREIGN KEY ("lottery_id") REFERENCES "tbl_lotteries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
