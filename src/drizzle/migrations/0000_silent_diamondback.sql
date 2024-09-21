DO $$ BEGIN
 CREATE TYPE "public"."COIN" AS ENUM('HEAD', 'TAIL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."FLIP_STATUS" AS ENUM('PENDING', 'WON', 'LOST', 'CANCELED');
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
DO $$ BEGIN
 CREATE TYPE "public"."LOTTERY_STATUS" AS ENUM('NOT_STARTED', 'OPEN', 'CLOSED', 'COMPLETED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."TRANSACTION_STATUS" AS ENUM('PENDING', 'CONFIRMED', 'FAILED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deposits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" varchar(255),
	"value" integer NOT NULL,
	"tx_hash" varchar(255) NOT NULL,
	"t_id" uuid NOT NULL,
	"status" "TRANSACTION_STATUS" DEFAULT 'PENDING',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "deposits_tx_hash_unique" UNIQUE("tx_hash"),
	CONSTRAINT "deposits_t_id_unique" UNIQUE("t_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flip" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player" varchar(255) NOT NULL,
	"amount_bet" integer NOT NULL,
	"guess" integer NOT NULL,
	"winner" boolean,
	"total_payout" integer,
	"total_profit" integer,
	"status" "FLIP_STATUS" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lottery" (
	"id" serial PRIMARY KEY NOT NULL,
	"prize_pool" integer NOT NULL,
	"ticket_price" integer NOT NULL,
	"total_tickets" integer NOT NULL,
	"sold_tickets" integer DEFAULT 0 NOT NULL,
	"winner" varchar(255),
	"status" "LOTTERY_STATUS" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roulette" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player" varchar(256) NOT NULL,
	"amount_bet" integer NOT NULL,
	"guess" integer NOT NULL,
	"winner" boolean NOT NULL,
	"eth_in_jackpot" integer NOT NULL,
	"guess_type" integer NOT NULL,
	"payout" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lottery_id" integer NOT NULL,
	"player_address" varchar(255) NOT NULL,
	"ticket_number" integer NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
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
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" varchar(255) NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "withdrawals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" varchar(255),
	"value" integer NOT NULL,
	"tx_hash" varchar(255) NOT NULL,
	"t_id" uuid NOT NULL,
	"status" "TRANSACTION_STATUS" DEFAULT 'PENDING',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "withdrawals_tx_hash_unique" UNIQUE("tx_hash"),
	CONSTRAINT "withdrawals_t_id_unique" UNIQUE("t_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deposits" ADD CONSTRAINT "deposits_address_users_address_fk" FOREIGN KEY ("address") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flip" ADD CONSTRAINT "flip_player_users_address_fk" FOREIGN KEY ("player") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lottery" ADD CONSTRAINT "lottery_winner_users_address_fk" FOREIGN KEY ("winner") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tickets" ADD CONSTRAINT "tickets_lottery_id_lottery_id_fk" FOREIGN KEY ("lottery_id") REFERENCES "public"."lottery"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tickets" ADD CONSTRAINT "tickets_player_address_users_address_fk" FOREIGN KEY ("player_address") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_address_users_address_fk" FOREIGN KEY ("address") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
