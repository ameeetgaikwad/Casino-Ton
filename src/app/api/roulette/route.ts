import { NextRequest, NextResponse } from 'next/server';
import { playRoulette, getLastPlayedGames } from '@/services/rouletteService';
import { protect } from '@/middlewares/authMiddlewares';

export async function POST(request: NextRequest) {
    const { action, guesses, guessTypes, betAmounts } = await request.json();
    console.log("got that post req", guesses, guessTypes, betAmounts);
    const token = request.headers.get('Authorization')?.replace("Bearer ", "");

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    const user = await protect(token)

    if (!user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    switch (action) {
        case 'play': {
            const result = await playRoulette(guesses, guessTypes, betAmounts, user.address);
            return NextResponse.json(result);
        }
        default:
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
        case 'last-played': {
            const limit = searchParams.get('limit');
            const games = await getLastPlayedGames(limit ? Number(limit) : undefined);
            return NextResponse.json(games);
        }
        default:
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
}