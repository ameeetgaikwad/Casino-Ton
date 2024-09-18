import {
  integer,
  pgEnum,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";

export const LOTTERY_STATUS = pgEnum('LOTTERY_STATUS', ["Active", "Pending", "Closed"]);

export const lotteries = pgTable("lotteries", {
  lotteryId: uuid("id").notNull().primaryKey().defaultRandom(),
  status: LOTTERY_STATUS("status"),                                     
  winningWalletAddress: text("winning_wallet_address"),
  count: integer("count").default(0),
  totalTickets: integer("total_tickets"),
  prizeSize: integer("prize_size"),    
  winningTicketId: integer("winning_ticket_id"),
  createdAt: timestamp('created_at').defaultNow(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date")
});
