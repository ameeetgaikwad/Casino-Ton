import {
  boolean,
  doublePrecision,
  pgEnum,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";


export const COIN = pgEnum('COIN', ["HEAD", "TAIL"])
export const GAME_TYPE = pgEnum('GAME_TYPE', ["COIN", "ROULETTE", "LOTTERY"])


export const transactionHistory = pgTable("transaction_history", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  player: text("player").notNull(),
  transaction: text("transaction").notNull(),
  outcome: text('outcome'),
  wager: doublePrecision("wager").notNull(),
  payout: doublePrecision("payout").notNull(),
  profit: doublePrecision("profit").notNull(),
  isWin: boolean('is_win'),
  gameType: GAME_TYPE("game_type"),
  createdAt: timestamp('created_at').defaultNow()
});
