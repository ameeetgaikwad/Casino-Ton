// app/api/flip/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { flipCoin, getGameCount, getGameEntries, getHouseBalance } from '@/services/flipService';
import { serializeBigInt } from '@/drizzle/schema';
import { protect } from '@/middlewares/authMiddlewares';

export async function POST(request: NextRequest) {
    const { guess, amountBet } = await request.json();
    console.log("POST request received", guess, amountBet * 10 ** Number(process.env.USDC_DECIMALS));
    const token = request.headers.get('Authorization')?.replace("Bearer ", "");

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    const user = await protect(token)

    if (!user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const result = await flipCoin(guess, user.address, Number(amountBet) * 10 ** Number(process.env.USDC_DECIMALS));
    if (!result) {
        return NextResponse.json({ error: 'Failed to flip coin' }, { status: 500 })
    }
    return NextResponse.json(serializeBigInt(result));
}

// export async function PUT(request: NextRequest) {
//     const { gameId } = await request.json();
//     console.log("PUT request received", gameId);
//     const token = request.headers.get('Authorization')?.replace("Bearer ", "");

//     if (!token) {
//         return NextResponse.json({ error: 'No token provided' }, { status: 401 })
//     }
//     const user = await protectAdmin(token)

//     if (!user) {
//         return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
//     }
//     const resolvedGame = await resolveGame(gameId);
//     if (!resolvedGame) {
//         return NextResponse.json({ error: 'Failed to resolve game' }, { status: 500 })
//     }
//     return NextResponse.json(resolvedGame);
// }

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const token = request.headers.get('Authorization')?.replace("Bearer ", "");

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const user = await protect(token);

    if (!user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (action === 'count') {
        const count = await getGameCount();
        return NextResponse.json({ count });
    }

    if (action === 'entries') {
        const limit = Number.parseInt(searchParams.get('limit') || '5');
        const entries = await getGameEntries(limit);
        return NextResponse.json(entries);
    }

    if (action === 'balance') {
        const balance = await getHouseBalance();
        return NextResponse.json({ balance });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
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