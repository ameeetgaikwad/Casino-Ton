import { pgTable, uuid, varchar, integer, boolean, timestamp, text, doublePrecision, foreignKey, unique, serial, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const coin = pgEnum("COIN", ['HEAD', 'TAIL'])
export const flipStatus = pgEnum("FLIP_STATUS", ['PENDING', 'WON', 'LOST', 'CANCELED'])
export const gameType = pgEnum("GAME_TYPE", ['COIN', 'ROULETTE', 'LOTTERY'])
export const lotteryStatus = pgEnum("LOTTERY_STATUS", ['NOT_STARTED', 'OPEN', 'CLOSED', 'COMPLETED'])
export const transactionStatus = pgEnum("TRANSACTION_STATUS", ['PENDING', 'CONFIRMED', 'FAILED'])



export const roulette = pgTable("roulette", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	player: varchar("player", { length: 256 }).notNull(),
	amountBet: integer("amount_bet").notNull(),
	guess: integer("guess").notNull(),
	winner: boolean("winner").notNull(),
	ethInJackpot: integer("eth_in_jackpot").notNull(),
	guessType: integer("guess_type").notNull(),
	payout: integer("payout").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const transactionHistory = pgTable("transaction_history", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	player: text("player").notNull(),
	transaction: text("transaction").notNull(),
	outcome: text("outcome"),
	wager: doublePrecision("wager").notNull(),
	payout: doublePrecision("payout").notNull(),
	profit: doublePrecision("profit").notNull(),
	isWin: boolean("is_win"),
	gameType: gameType("game_type"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const withdrawals = pgTable("withdrawals", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	address: varchar("address", { length: 255 }),
	value: integer("value").notNull(),
	txHash: varchar("tx_hash", { length: 255 }).notNull(),
	tId: uuid("t_id").notNull(),
	status: transactionStatus("status").default('PENDING'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		withdrawalsAddressUsersAddressFk: foreignKey({
			columns: [table.address],
			foreignColumns: [users.address],
			name: "withdrawals_address_users_address_fk"
		}),
		withdrawalsTxHashUnique: unique("withdrawals_tx_hash_unique").on(table.txHash),
		withdrawalsTIdUnique: unique("withdrawals_t_id_unique").on(table.tId),
	}
});

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	address: varchar("address", { length: 255 }).notNull(),
	balance: integer("balance").default(0).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		usersAddressUnique: unique("users_address_unique").on(table.address),
	}
});

export const deposits = pgTable("deposits", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	address: varchar("address", { length: 255 }),
	value: integer("value").notNull(),
	txHash: varchar("tx_hash", { length: 255 }).notNull(),
	tId: uuid("t_id").notNull(),
	status: transactionStatus("status").default('PENDING'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		depositsAddressUsersAddressFk: foreignKey({
			columns: [table.address],
			foreignColumns: [users.address],
			name: "deposits_address_users_address_fk"
		}),
		depositsTxHashUnique: unique("deposits_tx_hash_unique").on(table.txHash),
		depositsTIdUnique: unique("deposits_t_id_unique").on(table.tId),
	}
});

export const flip = pgTable("flip", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	player: varchar("player", { length: 255 }).notNull(),
	amountBet: integer("amount_bet").notNull(),
	guess: integer("guess").notNull(),
	winner: boolean("winner"),
	totalPayout: integer("total_payout"),
	totalProfit: integer("total_profit"),
	status: flipStatus("status").default('PENDING').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		flipPlayerUsersAddressFk: foreignKey({
			columns: [table.player],
			foreignColumns: [users.address],
			name: "flip_player_users_address_fk"
		}),
	}
});

export const lottery = pgTable("lottery", {
	id: serial("id").primaryKey().notNull(),
	prizePool: integer("prize_pool").notNull(),
	ticketPrice: integer("ticket_price").notNull(),
	totalTickets: integer("total_tickets").notNull(),
	soldTickets: integer("sold_tickets").default(0).notNull(),
	winner: varchar("winner", { length: 255 }),
	status: lotteryStatus("status").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		lotteryWinnerUsersAddressFk: foreignKey({
			columns: [table.winner],
			foreignColumns: [users.address],
			name: "lottery_winner_users_address_fk"
		}),
	}
});

export const tickets = pgTable("tickets", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	lotteryId: integer("lottery_id").notNull(),
	playerAddress: varchar("player_address", { length: 255 }).notNull(),
	ticketNumber: integer("ticket_number").notNull(),
	amount: integer("amount").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		ticketsLotteryIdLotteryIdFk: foreignKey({
			columns: [table.lotteryId],
			foreignColumns: [lottery.id],
			name: "tickets_lottery_id_lottery_id_fk"
		}),
		ticketsPlayerAddressUsersAddressFk: foreignKey({
			columns: [table.playerAddress],
			foreignColumns: [users.address],
			name: "tickets_player_address_users_address_fk"
		}),
	}
});