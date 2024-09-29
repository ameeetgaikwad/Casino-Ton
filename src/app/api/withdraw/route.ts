import { NextRequest, NextResponse } from "next/server";
import { serializeBigInt, withdrawals } from "@/drizzle/schema"
import { protect } from "@/middlewares/authMiddlewares";
import { db } from "@/drizzle/db";
import { globalConfig } from "@/config/global";

export async function POST(request: NextRequest) {
    const { amount } = await request.json();
    console.log("POST request received", amount * 10 ** Number(process.env.USDC_DECIMALS));
    const token = request.headers.get('Authorization')?.replace("Bearer ", "");

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    const user = await protect(token)

    if (!user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const result = await db.insert(withdrawals).values({ value: BigInt(amount) * BigInt(10 ** Number(process.env.USDC_DECIMALS)), from: globalConfig.houseAddress, to: user.address }).returning()
    return NextResponse.json(serializeBigInt(result));
}