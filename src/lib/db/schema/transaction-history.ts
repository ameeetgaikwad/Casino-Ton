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
export const transactionHistory = pgTable("transaction_history_bsc", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  player: text("player").notNull(),
  transaction: text("transaction").notNull(),
  outcome: COIN('outcome'),
  wager: doublePrecision("wager").notNull(),
  payout: doublePrecision("payout").notNull(),
  profit: doublePrecision("profit").notNull(),
  isWin: boolean('is_win'),
  createdAt: timestamp('created_at').defaultNow()
});
