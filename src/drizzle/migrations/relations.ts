import { relations } from "drizzle-orm/relations";
import { users, withdrawals, deposits, flip, lottery, tickets } from "./schema";

export const withdrawalsRelations = relations(withdrawals, ({one}) => ({
	user: one(users, {
		fields: [withdrawals.address],
		references: [users.address]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	withdrawals: many(withdrawals),
	deposits: many(deposits),
	flips: many(flip),
	lotteries: many(lottery),
	tickets: many(tickets),
}));

export const depositsRelations = relations(deposits, ({one}) => ({
	user: one(users, {
		fields: [deposits.address],
		references: [users.address]
	}),
}));

export const flipRelations = relations(flip, ({one}) => ({
	user: one(users, {
		fields: [flip.player],
		references: [users.address]
	}),
}));

export const lotteryRelations = relations(lottery, ({one, many}) => ({
	user: one(users, {
		fields: [lottery.winner],
		references: [users.address]
	}),
	tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({one}) => ({
	lottery: one(lottery, {
		fields: [tickets.lotteryId],
		references: [lottery.id]
	}),
	user: one(users, {
		fields: [tickets.playerAddress],
		references: [users.address]
	}),
}));