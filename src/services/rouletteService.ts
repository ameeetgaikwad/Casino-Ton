import { eq, sql } from 'drizzle-orm';
import { db } from '@/db/index';
import { roulette, users, Game } from '@/drizzle/schema';

enum GuessType {
    Number = 0,
    Even = 1,
    Odd = 2
}

const HOUSE_FEE_PERCENTAGE = 1; // 1% house fee

export async function playRoulette(
    guesses: number[],
    guessTypes: GuessType[],
    betAmounts: number[],
    playerAddress: string
): Promise<{ gameId: string }> {
    if (guesses.length !== guessTypes.length || guessTypes.length !== betAmounts.length) {
        throw new Error("Mismatch in array lengths");
    }

    const totalBetAmount = betAmounts.reduce((a, b) => a + b, 0);
    const userBalance = await db.select({ balance: users.balance }).from(users).where(eq(users.address, playerAddress));

    if (userBalance[0].balance < totalBetAmount) {
        throw new Error("Insufficient balance");
    }

    const houseEdgeCut = (totalBetAmount * HOUSE_FEE_PERCENTAGE) / 100;
    const actualBet = totalBetAmount - houseEdgeCut;

    const result = Math.floor(Math.random() * 37); // Generate a random number between 0 and 36

    let totalPayout = 0;
    const games: Omit<Game, 'id' | 'createdAt'>[] = [];

    for (let i = 0; i < guesses.length; i++) {
        const [won, payout] = processBet(guesses[i], guessTypes[i], betAmounts[i], result);

        if (won) {
            totalPayout += payout;
        }

        games.push({
            player: playerAddress,
            amountBet: betAmounts[i],
            guess: guesses[i],
            winner: won,
            ethInJackpot: actualBet,
            guessType: guessTypes[i],
            payout: payout
        });
    }

    let insertedGames: Game[] = [];

    await db.transaction(async (tx) => {
        await tx.update(users)
            .set({ balance: sql`${users.balance}-${totalBetAmount}` })
            .where(eq(users.address, playerAddress));

        if (totalPayout > 0) {
            await tx.update(users)
                .set({ balance: sql`${users.balance}+${totalPayout}` })
                .where(eq(users.address, playerAddress));
        }

        insertedGames = await tx.insert(roulette).values(games).returning();
    });

    return { gameId: insertedGames[0].id };
}

function processBet(guess: number, guessType: GuessType, betAmount: number, result: number): [boolean, number] {
    if (guess === result && guessType === GuessType.Number) {
        return [true, (betAmount * 3500) / 100];
    }
    if (guess % 2 === 0 && guessType === GuessType.Even && result % 2 === 0) {
        return [true, (betAmount * 188) / 100];
    }
    if (guess % 2 !== 0 && guessType === GuessType.Odd && result % 2 !== 0) {
        return [true, (betAmount * 188) / 100];
    }
    return [false, 0];
}

export async function getLastPlayedGames(limit: number = 10): Promise<Game[]> {
    return await db.select().from(roulette).orderBy(sql`${roulette.createdAt} DESC`).limit(limit);
}

export async function withdrawFunds(amount: number, ownerAddress: string): Promise<void> {
    const ownerBalance = await db.select({ balance: users.balance }).from(users).where(eq(users.address, ownerAddress));

    if (ownerBalance[0].balance < amount) {
        throw new Error("Insufficient balance");
    }

    await db.update(users)
        .set({ balance: sql`${users.balance}-${amount}` })
        .where(eq(users.address, ownerAddress));
}