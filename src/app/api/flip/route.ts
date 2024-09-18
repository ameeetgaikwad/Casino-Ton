// app/api/flip/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { flipCoin, resolveGame } from '@/services/flipService';

export async function POST(request: NextRequest) {
    const { guess, playerAddress, amountBet } = await request.json();
    const result = await flipCoin(guess, playerAddress, amountBet);
    return NextResponse.json(result);
}

export async function PUT(request: NextRequest) {
    const { gameId, result } = await request.json();
    const resolvedGame = await resolveGame(gameId, result);
    return NextResponse.json(resolvedGame);
}

// export async function GET(request: NextRequest) {
//     const { searchParams } = new URL(request.url);
//     const action = searchParams.get('action');

//     if (action === 'count') {
//         const count = await getGameCount();
//         return NextResponse.json({ count });
//     } else if (action === 'entry') {
//         const index = searchParams.get('index');
//         if (index) {
//             const entry = await getGameEntry(parseInt(index));
//             return NextResponse.json(entry);
//         }
//     }

//     return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
// }