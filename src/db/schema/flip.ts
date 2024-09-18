import { serial, varchar, integer, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { pgTable } from "./_table";

export const games = pgTable('games', {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    gameId: varchar('game_id', { length: 36 }).notNull().unique(),
    player: varchar('player', { length: 255 }).notNull(),
    amountBet: integer('amount_bet').notNull(),
    guess: integer('guess').notNull(),
    winner: boolean('winner'),
    totalPayout: integer('total_payout'),
    totalProfit: integer('total_profit'),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;