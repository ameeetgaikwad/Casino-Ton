import {
  boolean,
  integer,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";
import * as lotteries from "./lotteries";

import { pgTable } from "./_table";

export const tickets = pgTable("tickets", {
  ticketId: uuid("ticket_id").notNull().primaryKey().defaultRandom(),
  lotteryId: integer("lottery_id").notNull().references(() => lotteries.lotteries.lotteryId),
  walletAddress: text("wallet_address").notNull(),
  purchaseDate: timestamp("purchase_date"),
  winner: boolean("winner")
});
