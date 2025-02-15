import { eq, sql, desc } from 'drizzle-orm';
import { lottery, serializeBigInt, Ticket, tickets, users } from '@/drizzle/schema';
import { lotteryConfig } from '@/config/lottery';
import { db } from '@/drizzle/db';
import { globalConfig } from '@/config/global';

export async function startLottery(prizePool: number, ticketPrice: number, totalTickets: number) {

    const newLottery = await db.insert(lottery).values({
        prizePool: BigInt(prizePool),
        ticketPrice: BigInt(ticketPrice),
        totalTickets,
        soldTickets: 0,
        status: 'OPEN'
    }).returning();

    return serializeBigInt(newLottery[0])
}

export async function buyTickets(lotteryId: number, numberOfTickets: number, playerAddress: string) {

    const lotteryInfo = await db.select().from(lottery).where(eq(lottery.id, lotteryId)).limit(1);

    if (!lotteryInfo[0] || lotteryInfo[0].status !== 'OPEN') {
        throw new Error("Lottery is not open");
    }

    const totalPrice = lotteryInfo[0].ticketPrice * BigInt(numberOfTickets);
    const userBalance = await db.select({ balance: users.balance }).from(users).where(eq(users.address, playerAddress));

    if (userBalance[0].balance < totalPrice) {
        throw new Error("Insufficient balance");
    }

    if (lotteryInfo[0].soldTickets + numberOfTickets > lotteryInfo[0].totalTickets) {
        throw new Error("Not enough tickets available");
    }

    const purchasedTickets: Ticket[] = [];

    await db.transaction(async (tx) => {
        await tx.update(users).set({ balance: sql`${users.balance}-${totalPrice}` }).where(eq(users.address, playerAddress));

        for (let i = 0; i < numberOfTickets; i++) {
            const ticketNumber = lotteryInfo[0].soldTickets + i;
            const newTicket = await tx.insert(tickets).values({
                lotteryId,
                playerAddress,
                ticketNumber,
                amount: lotteryInfo[0].ticketPrice
            }).returning();
            purchasedTickets.push(newTicket[0]);
        }

        await tx.update(lottery)
            .set({ soldTickets: sql`${lottery.soldTickets}+${numberOfTickets}` })
            .where(eq(lottery.id, lotteryId));
    });

    return purchasedTickets.map(ticket => ({
        ...ticket,
        amount: ticket.amount.toString()
    }));
}

export async function runLottery(lotteryId: number) {
    console.log('running lottery', lotteryId)
    const lotteryInfo = await db.select().from(lottery).where(eq(lottery.id, lotteryId)).limit(1);

    if (!lotteryInfo[0] || lotteryInfo[0].status !== 'CLOSED') {
        throw new Error("Lottery is not closed");
    }

    const randomNumber = Math.floor(Math.random() * (lotteryInfo[0].soldTickets));

    const winningTicket = await db.select().from(tickets)
        .where(eq(tickets.lotteryId, lotteryId))
        .limit(1)
        .offset(randomNumber);

    if (!winningTicket[0]) {
        throw new Error("No winning ticket found");
    }
    console.log('lotteryInfo[0].prizePool', lotteryInfo[0].prizePool, lotteryConfig.houseFeePercentage)
    const houseFee = (BigInt(lotteryInfo[0].prizePool) * BigInt(lotteryConfig.houseFeePercentage)) / BigInt(100);
    console.log('houseFee', houseFee)
    const winnerPrize = BigInt(lotteryInfo[0].prizePool) - houseFee;

    await db.transaction(async (tx) => {
        await tx.update(lottery)
            .set({
                status: 'COMPLETED',
                winner: winningTicket[0].playerAddress
            })
            .where(eq(lottery.id, lotteryId));

        await tx.update(users)
            .set({ balance: sql`${users.balance}+${winnerPrize}` })
            .where(eq(users.address, winningTicket[0].playerAddress));

        await tx.update(users)
            .set({ balance: sql`${users.balance}+${houseFee}` })
            .where(eq(users.address, globalConfig.houseAddress));
    });

    return {
        lotteryId,
        winner: winningTicket[0].playerAddress,
        prize: winnerPrize.toString() // Convert BigInt to string
    };
}

export async function forceCompleteLottery(lotteryId: number) {
    const result = await db.update(lottery)
        .set({ status: 'CLOSED' })
        .where(eq(lottery.id, lotteryId))
        .returning();

    return serializeBigInt(result[0]);
}

export async function getLotteryInfo(lotteryId: number) {
    const lotteryInfo = await db.select().from(lottery).where(eq(lottery.id, lotteryId)).limit(1);
    if (lotteryInfo[0]) {
        return {
            ...lotteryInfo[0],
            prizePool: lotteryInfo[0].prizePool.toString(),
            ticketPrice: lotteryInfo[0].ticketPrice.toString()
        };
    }
    return null;
}

export async function getPlayerTickets(playerAddress: string) {
    return await db.select().from(tickets).where(eq(tickets.playerAddress, playerAddress));
}

export async function getActiveLotteries() {
    const activeLotteries = await db.select().from(lottery).where(eq(lottery.status, 'OPEN')).orderBy(desc(lottery.createdAt));
    return activeLotteries.map(lotteryInfo => ({
        ...lotteryInfo,
        prizePool: lotteryInfo.prizePool.toString(),
        ticketPrice: lotteryInfo.ticketPrice.toString()
    }));
}

export async function getAllLotteries() {
    return await db.select().from(lottery);
}

export async function getPlayerLotteries(playerAddress: string) {
    const playerTickets = await db.select().from(tickets).where(eq(tickets.playerAddress, playerAddress));

    if (playerTickets.length === 0) {
        console.log('no tickets')
        return []
    }

    const lotteryIds = [...new Set(playerTickets.map(ticket => ticket.lotteryId))];

    const lotteries = await db.select().from(lottery).where(sql`${lottery.id} IN ${lotteryIds}`).orderBy(desc(lottery.createdAt));

    return lotteries.map(lotteryInfo => ({
        ...lotteryInfo,
        prizePool: lotteryInfo.prizePool.toString(),
        ticketPrice: lotteryInfo.ticketPrice.toString(),
        ticketsPurchased: playerTickets.filter(ticket => ticket.lotteryId === lotteryInfo.id).length
    }));
}

export async function getTotalTicketsSold(lotteryId: number) {
    const result = await db.select({ soldTickets: lottery.soldTickets })
        .from(lottery)
        .where(eq(lottery.id, lotteryId))
        .limit(1);

    if (!result[0]) {
        throw new Error("Invalid lottery ID");
    }

    return result[0].soldTickets;
}

export async function getRemainingTickets(lotteryId: number) {
    const result = await db.select({
        totalTickets: lottery.totalTickets,
        soldTickets: lottery.soldTickets
    })
        .from(lottery)
        .where(eq(lottery.id, lotteryId))
        .limit(1);

    if (!result[0]) {
        throw new Error("Invalid lottery ID");
    }

    return result[0].totalTickets - result[0].soldTickets;
}

export async function getLotteryStatus(lotteryId: number) {
    const result = await db.select({ status: lottery.status })
        .from(lottery)
        .where(eq(lottery.id, lotteryId))
        .limit(1);

    if (!result[0]) {
        throw new Error("Invalid lottery ID");
    }

    return result[0].status;
}

export async function getPlayerTicketsForLottery(playerAddress: string, lotteryId: number) {
    const playerTickets = await db.select({ ticketNumber: tickets.ticketNumber })
        .from(tickets)
        .where(
            sql`${tickets.playerAddress} = ${playerAddress} AND ${tickets.lotteryId} = ${lotteryId}`
        );

    return playerTickets.map(ticket => ticket.ticketNumber);
}

export async function getTotalPlayerTickets(playerAddress: string) {
    const result = await db.select({ count: sql<number>`count(*)` })
        .from(tickets)
        .where(eq(tickets.playerAddress, playerAddress));

    return result[0].count;
}

export async function getPlayerRecentTickets(playerAddress: string, count: number) {
    const recentTickets = await db.select()
        .from(tickets)
        .where(eq(tickets.playerAddress, playerAddress))
        .orderBy(sql`${tickets.id} DESC`)
        .limit(count);

    return recentTickets;
}

export async function getLotteryDetailsForPlayer(lotteryId: number, playerAddress: string) {
    const lotteryInfo = await getLotteryInfo(lotteryId);
    if (!lotteryInfo) {
        throw new Error("Invalid lottery ID");
    }

    const ticketsPurchased = await getPlayerTicketsForLottery(playerAddress, lotteryId);
    const remainingTickets = await getRemainingTickets(lotteryId);

    return {
        lotteryId: lotteryInfo.id,
        ticketsPurchased: ticketsPurchased.length,
        ticketPrice: lotteryInfo.ticketPrice,
        status: lotteryInfo.status,
        remainingTickets,
        prizePool: lotteryInfo.prizePool,
        winner: lotteryInfo.winner
    };
}