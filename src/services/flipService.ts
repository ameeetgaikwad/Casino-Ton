import { eq, sql } from 'drizzle-orm';
import { db } from '@/db/index';
import { flip, users } from '@/drizzle/schema';
import type { Flip } from '@/drizzle/schema';
import { gameConfig } from '@/config/flip';

export async function flipCoin(guess: number, playerAddress: string, amountBet: number): Promise<{ gameId: string }> {
    const userBalance = await db.select({ balance: users.balance }).from(users).where(eq(users.address, playerAddress));
    const houseBalance = await db.select({ balance: users.balance }).from(users).where(eq(users.address, gameConfig.houseAddress));

    if (userBalance[0].balance < amountBet) {
        throw new Error("Insufficient balance");
    }

    if (guess !== 0 && guess !== 1) {
        throw new Error("Guess should be 0 (heads) or 1 (tails)");
    }

    if (amountBet <= 0) {
        throw new Error("Amount bet must be greater than 0");
    }

    // const houseEdgeCut = (amountBet * gameConfig.platformFeePercentage) / 100;
    // const actualBet = amountBet - houseEdgeCut;

    if (amountBet > (houseBalance[0].balance * gameConfig.maxBetPercentage / 100)) {
        throw new Error("Bet exceeds maximum allowed");
    }

    await db.transaction(async (tx) => {
        await tx.update(users).set({ balance: sql`${users.balance}-${amountBet}` }).where(eq(users.address, playerAddress));

        await tx.update(users).set({ balance: sql`${users.balance}+${amountBet}` }).where(eq(users.address, gameConfig.houseAddress));
    });

    const gameId = await db.insert(flip).values({ player: playerAddress, amountBet: amountBet, guess: guess, status: 'PENDING' }).returning({ id: flip.id });

    return { gameId: gameId[0].id };
}

export async function resolveGame(gameId: string, result: number): Promise<Flip> {
    const game = await db.select().from(flip).where(eq(flip.id, gameId)).limit(1);
    const won: boolean = Math.random() < 0.46

    if (!game[0]) {
        throw new Error("Game does not exist");
    }

    if (game[0].status !== 'PENDING') {
        throw new Error("Game has already been resolved");
    }
    if (result !== 0 && result !== 1) {
        throw new Error("Result should be 0 (heads) or 1 (tails)");
    }

    let totalPayout = 0;
    let totalProfit = 0;

    if (won) {
        totalPayout = Math.floor((game[0].amountBet * gameConfig.winnerBetPercentage) / 100);
        totalProfit = totalPayout - game[0].amountBet;

        await db.transaction(async (tx) => {
            await tx.update(users).set({ balance: sql`${users.balance}+${totalPayout}` }).where(eq(users.address, game[0].player));
        });
    } else {
        totalProfit = -game[0].amountBet;
    }

    const updatedGame = await db
        .update(flip)
        .set({
            winner: won,
            totalPayout,
            totalProfit,
            status: won ? 'WON' : 'LOST',
            updatedAt: new Date(),
        })
        .where(eq(flip.id, gameId))
        .returning();

    return updatedGame[0];
}

// export async function getGameCount(): Promise<number> {
//     const result = await db.select({ count: flip.id }).from(flip);
//     return Number(result[0].count) || 0;
// }

// export async function getGameEntry(index: number): Promise<Game | null> {
//     const [game] = await db.select().from(flip).limit(1).offset(index);
//     return game || null;
// }