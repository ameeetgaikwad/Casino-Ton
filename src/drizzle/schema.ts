import {
    bigint,
    boolean,
    decimal,
    doublePrecision,
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    uuid,
    varchar
} from "drizzle-orm/pg-core";

// export const LOTTERY_STATUS = pgEnum('LOTTERY_STATUS', ["Active", "Pending", "Closed"]);

// export const lotteries = pgTable("lotteries", {
//     lotteryId: uuid("id").notNull().primaryKey().defaultRandom(),
//     status: LOTTERY_STATUS("status"),
//     winningWalletAddress: text("winning_wallet_address"),
//     count: integer("count").default(0),
//     totalTickets: integer("total_tickets"),
//     prizeSize: integer("prize_size"),
//     winningTicketId: integer("winning_ticket_id"),
//     createdAt: timestamp('created_at').defaultNow(),
//     startDate: timestamp("start_date"),
//     endDate: timestamp("end_date")
// });


// export const tickets = pgTable("tickets", {
//     ticketId: uuid("ticket_id").notNull().primaryKey().defaultRandom(),
//     lotteryId: integer("lottery_id").notNull().references(() => lotteries.lotteries.lotteryId),
//     walletAddress: text("wallet_address").notNull(),
//     purchaseDate: timestamp("purchase_date"),
//     winner: boolean("winner")
// });

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

export const users = pgTable('users', {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    address: varchar('address', { length: 255 }).notNull().unique(),
    balance: bigint('balance', { mode: 'bigint' }).notNull().default(0n),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// flip game
export const FLIP_STATUS = pgEnum('FLIP_STATUS', ["PENDING", "WON", "LOST", "CANCELED"])

export const flip = pgTable('flip', {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    player: varchar('player', { length: 255 }).notNull().references(() => users.address),
    amountBet: bigint('amount_bet', { mode: 'bigint' }).notNull(),
    guess: integer('guess').notNull(),
    winner: boolean('winner'),
    totalPayout: bigint('total_payout', { mode: 'bigint' }),
    totalProfit: bigint('total_profit', { mode: 'bigint' }),
    status: FLIP_STATUS("status").notNull().default('PENDING'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


export const LOTTERY_STATUS = pgEnum('LOTTERY_STATUS', ["NOT_STARTED", "OPEN", "CLOSED", "COMPLETED"])

export const lottery = pgTable('lottery', {
    id: serial('id').primaryKey(),
    prizePool: bigint('prize_pool', { mode: 'bigint' }).notNull(),
    ticketPrice: bigint('ticket_price', { mode: 'bigint' }).notNull(),
    totalTickets: integer('total_tickets').notNull(),
    soldTickets: integer('sold_tickets').notNull().default(0),
    winner: varchar('winner', { length: 255 }).references(() => users.address),
    status: LOTTERY_STATUS("status").notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const tickets = pgTable('tickets', {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    lotteryId: integer('lottery_id').notNull().references(() => lottery.id),
    playerAddress: varchar('player_address', { length: 255 }).notNull().references(() => users.address),
    ticketNumber: integer('ticket_number').notNull(),
    amount: bigint('amount', { mode: 'bigint' }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const TRANSACTION_STATUS = pgEnum('TRANSACTION_STATUS', ["PENDING", "CONFIRMED", "FAILED"])

export const deposits = pgTable('deposits', {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    from: varchar('from', { length: 255 }).references(() => users.address),
    to: varchar('to', { length: 255 }).references(() => users.address),
    value: bigint('value', { mode: 'bigint' }),
    txHash: varchar('tx_hash', { length: 255 }).unique(),
    tId: uuid('t_id').notNull().unique(),
    status: TRANSACTION_STATUS("status").default('PENDING'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const withdrawals = pgTable('withdrawals', {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    from: varchar('from', { length: 255 }).references(() => users.address),
    to: varchar('to', { length: 255 }).references(() => users.address),
    value: bigint('value', { mode: 'bigint' }).notNull(),
    txHash: varchar('tx_hash', { length: 255 }).unique(),
    tId: uuid('t_id').unique(),
    status: TRANSACTION_STATUS("status").default('PENDING'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const roulette = pgTable('roulette', {
    id: uuid('id').defaultRandom().primaryKey(),
    player: varchar('player', { length: 256 }).notNull(),
    amountBet: bigint('amount_bet', { mode: 'bigint' }).notNull(),
    guess: integer('guess').notNull(),
    winner: boolean('winner').notNull(),
    USDCInJackpot: bigint('usdc_in_jackpot', { mode: 'bigint' }).notNull(),
    guessType: integer('guess_type').notNull(),
    payout: bigint('payout', { mode: 'bigint' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});

export type Flip = typeof flip.$inferSelect;
export type NewFlip = typeof flip.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Deposit = typeof deposits.$inferSelect;
export type NewDeposit = typeof deposits.$inferInsert;
export type NewWithdrawal = typeof withdrawals.$inferInsert;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type Roulette = typeof roulette.$inferSelect;
export type NewRoulette = typeof roulette.$inferInsert;
export type Lottery = typeof lottery.$inferSelect;
export type NewLottery = typeof lottery.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;

export type GameType = (typeof GAME_TYPE.enumValues)[number];
export type TransactionHistoryI = typeof transactionHistory.$inferSelect;
export type NewTransactionHistoryI = typeof transactionHistory.$inferInsert;

// Add a custom serializer function
export function serializeBigInt(obj: any): any {
    return JSON.parse(JSON.stringify(obj, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
}