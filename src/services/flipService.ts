import { eq, sql } from 'drizzle-orm';
import { flip, users } from '@/drizzle/schema';
import type { Flip } from '@/drizzle/schema';
import { gameConfig } from '@/config/flip';
import { db } from '@/drizzle/db';
import { globalConfig } from '@/config/global';

export async function flipCoin(guess: number, playerAddress: string, amountBet: number): Promise<{ gameId: string, result: Flip } | null> {
    console.log('flipCoin', guess, playerAddress, amountBet)
    const userBalance = await db.select({ balance: users.balance }).from(users).where(eq(users.address, playerAddress));

    const houseBalance = await db.select({ balance: users.balance }).from(users).where(eq(users.address, globalConfig.houseAddress));

    if (userBalance[0].balance < amountBet) {
        console.log('Insufficient balance')
        return null;
    }

    if (guess !== 0 && guess !== 1) {
        console.log('Guess should be 0 (heads) or 1 (tails)')
        return null;
    }

    if (amountBet <= 0) {
        console.log('Amount bet must be greater than 0')
        return null;
    }

    // const houseEdgeCut = (amountBet * gameConfig.platformFeePercentage) / 100;
    // const actualBet = amountBet - houseEdgeCut;

    if (amountBet > (houseBalance[0].balance * gameConfig.maxBetPercentage / 100)) {
        console.log('Bet exceeds maximum allowed')
        return null;
    }

    let gameId: string;
    let result: Flip;

    await db.transaction(async (tx) => {
        // Deduct bet amount from player's balance
        await tx.update(users).set({ balance: sql`${users.balance}-${amountBet}` }).where(eq(users.address, playerAddress));

        // Add bet amount to house balance
        await tx.update(users).set({ balance: sql`${users.balance}+${amountBet}` }).where(eq(users.address, globalConfig.houseAddress));

        // Insert new game
        const insertedGame = await tx.insert(flip).values({ player: playerAddress, amountBet: amountBet, guess: guess, status: 'PENDING' }).returning({ id: flip.id });
        gameId = insertedGame[0].id;

        // Resolve the game
        const won: boolean = Math.random() < 0.46;
        let totalPayout = 0;
        let totalProfit = 0;

        if (won) {
            totalPayout = Math.floor((amountBet * gameConfig.winnerBetPercentage) / 100);
            totalProfit = totalPayout - amountBet;

            // Update player's balance with winnings
            await tx.update(users).set({ balance: sql`${users.balance}+${totalPayout}` }).where(eq(users.address, playerAddress));

            // Deduct payout from house balance
            await tx.update(users).set({ balance: sql`${users.balance}-${totalPayout}` }).where(eq(users.address, globalConfig.houseAddress));
        } else {
            totalProfit = -amountBet;
        }

        // Update game result
        result = (await tx.update(flip)
            .set({
                winner: won,
                totalPayout,
                totalProfit,
                status: won ? 'WON' : 'LOST',
                updatedAt: new Date(),
            })
            .where(eq(flip.id, gameId))
            .returning())[0];
    });
    // @ts-ignore
    return { gameId, result };
}

export async function resolveGame(gameId: string): Promise<Flip | null> {
    const game = await db.select().from(flip).where(eq(flip.id, gameId)).limit(1);
    const won: boolean = Math.random() < 0.46

    if (!game[0]) {
        console.log('Game does not exist')
        return null;
    }

    if (game[0].status !== 'PENDING') {
        console.log('Game has already been resolved')
        return null;
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

export async function getGameCount(): Promise<number> {
    const result = await db.select({ count: sql`count(${flip.id})` }).from(flip);
    return Number(result[0].count) || 0;
}

export async function getGameEntries(limit: number): Promise<Flip[]> {
    return db.select().from(flip).orderBy(sql`${flip.createdAt} DESC`).limit(limit);
}

export async function getHouseBalance(): Promise<number> {
    const result = await db.select({ balance: users.balance }).from(users).where(eq(users.address, globalConfig.houseAddress));
    return Number(result[0].balance) || 0;
}
// export async function getGameCount(): Promise<number> {
//     const result = await db.select({ count: flip.id }).from(flip);
//     return Number(result[0].count) || 0;
// }

// export async function getGameEntry(index: number): Promise<Game | null> {
//     const [game] = await db.select().from(flip).limit(1).offset(index);
//     return game || null;
// }