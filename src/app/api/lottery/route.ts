import { NextRequest, NextResponse } from 'next/server';
import { startLottery, buyTickets, runLottery, forceCompleteLottery, getLotteryInfo, getPlayerTickets, getActiveLotteries, getPlayerLotteries } from '@/services/lotteryService';

export async function POST(request: NextRequest) {
    const { action } = await request.json();

    switch (action) {
        case 'startLottery': {
            const { prizePool, ticketPrice, totalTickets } = await request.json();
            const result = await startLottery(prizePool, ticketPrice, totalTickets);
            return NextResponse.json(result);
        }

        case 'buyTickets': {
            const { lotteryId, numberOfTickets, playerAddress } = await request.json();
            const tickets = await buyTickets(lotteryId, numberOfTickets, playerAddress);
            return NextResponse.json(tickets);
        }

        case 'runLottery': {
            const { lotteryId: runLotteryId } = await request.json();
            const runResult = await runLottery(runLotteryId);
            return NextResponse.json(runResult);
        }

        case 'forceCompleteLottery': {
            const { lotteryId: forceLotteryId } = await request.json();
            const forceResult = await forceCompleteLottery(forceLotteryId);
            return NextResponse.json(forceResult);
        }

        default:
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
        case 'getLotteryInfo': {
            const lotteryId = searchParams.get('lotteryId');
            if (lotteryId) {
                const lotteryInfo = await getLotteryInfo(parseInt(lotteryId));
                return NextResponse.json(lotteryInfo);
            }
            break;
        }

        case 'getPlayerTickets': {
            const playerAddress = searchParams.get('playerAddress');
            if (playerAddress) {
                const playerTickets = await getPlayerTickets(playerAddress);
                return NextResponse.json(playerTickets);
            }
            break;
        }

        case 'getActiveLotteries': {
            const activeLotteries = await getActiveLotteries();
            return NextResponse.json(activeLotteries);
        }

        case 'getPlayerLotteries': {
            const player = searchParams.get('playerAddress');
            if (player) {
                const playerLotteries = await getPlayerLotteries(player);
                return NextResponse.json(playerLotteries);
            }
            break;
        }

        default:
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
}