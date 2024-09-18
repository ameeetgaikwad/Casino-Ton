import { NextRequest, NextResponse } from 'next/server';
import { playRoulette, getLastPlayedGames, withdrawFunds } from '@/services/rouletteService';

export async function POST(request: NextRequest) {
    const { action } = await request.json();

    switch (action) {
        case 'play': {
            const { guesses, guessTypes, betAmounts, playerAddress } = await request.json();
            const result = await playRoulette(guesses, guessTypes, betAmounts, playerAddress);
            return NextResponse.json(result);
        }
        case 'withdraw': {
            const { amount, ownerAddress } = await request.json();
            await withdrawFunds(amount, ownerAddress);
            return NextResponse.json({ success: true });
        }
        default:
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
        case 'getLastPlayedGames': {
            const limit = searchParams.get('limit');
            const games = await getLastPlayedGames(limit ? Number(limit) : undefined);
            return NextResponse.json(games);
        }
        default:
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
}