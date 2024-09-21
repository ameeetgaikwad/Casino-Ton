DO $$ BEGIN
 CREATE TYPE "public"."FLIP_STATUS" AS ENUM('PENDING', 'WON', 'LOST', 'CANCELED');
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
CREATE TABLE IF NOT EXISTS "lottery" (
	"id" serial PRIMARY KEY NOT NULL,
	"prize_pool" bigint NOT NULL,
	"ticket_price" bigint NOT NULL,
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
	"amount_bet" bigint NOT NULL,
	"guess" integer NOT NULL,
	"winner" boolean NOT NULL,
	"eth_in_jackpot" integer NOT NULL,
	"guess_type" integer NOT NULL,
	"payout" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lottery_id" integer NOT NULL,
	"player_address" varchar(255) NOT NULL,
	"ticket_number" integer NOT NULL,
	"amount" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flip" DROP CONSTRAINT "flip_game_id_unique";--> statement-breakpoint
ALTER TABLE "deposits" DROP CONSTRAINT "deposits_from_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "deposits" DROP CONSTRAINT "deposits_to_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "withdrawals" DROP CONSTRAINT "withdrawals_from_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "withdrawals" DROP CONSTRAINT "withdrawals_to_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "deposits" ALTER COLUMN "value" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "flip" ALTER COLUMN "amount_bet" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "flip" ALTER COLUMN "total_payout" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "flip" ALTER COLUMN "total_profit" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "flip" ALTER COLUMN "status" SET DATA TYPE FLIP_STATUS;--> statement-breakpoint
ALTER TABLE "flip" ALTER COLUMN "status" SET DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "balance" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "balance" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "withdrawals" ALTER COLUMN "value" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "deposits" ADD COLUMN "from" varchar(255);--> statement-breakpoint
ALTER TABLE "deposits" ADD COLUMN "to" varchar(255);--> statement-breakpoint
ALTER TABLE "withdrawals" ADD COLUMN "address" varchar(255);--> statement-breakpoint
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
 ALTER TABLE "deposits" ADD CONSTRAINT "deposits_from_users_address_fk" FOREIGN KEY ("from") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deposits" ADD CONSTRAINT "deposits_to_users_address_fk" FOREIGN KEY ("to") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_address_users_address_fk" FOREIGN KEY ("address") REFERENCES "public"."users"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "deposits" DROP COLUMN IF EXISTS "from_user_id";--> statement-breakpoint
ALTER TABLE "deposits" DROP COLUMN IF EXISTS "to_user_id";--> statement-breakpoint
ALTER TABLE "flip" DROP COLUMN IF EXISTS "game_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "withdrawals" DROP COLUMN IF EXISTS "from_user_id";--> statement-breakpoint
ALTER TABLE "withdrawals" DROP COLUMN IF EXISTS "to_user_id";