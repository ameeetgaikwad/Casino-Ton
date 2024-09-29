import { NextRequest, NextResponse } from "next/server";
import { deposits, serializeBigInt, users, withdrawals } from "@/drizzle/schema"

import { desc, eq } from 'drizzle-orm'
import { protect } from "@/middlewares/authMiddlewares";
import { db } from "@/drizzle/db";


export async function GET(request: NextRequest) {
    try {
        console.log('GET request')
        const token = request.headers
            .get("Authorization")
            ?.replace("Bearer ", "");

        if (!token) {
            return NextResponse.json(
                { error: "No token provided" },
                { status: 401 }
            );
        }
        const user = await protect(token);

        if (!user) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const history = await db.select().from(withdrawals).where(eq(withdrawals.to, user.address)).orderBy(desc(withdrawals.createdAt)).limit(10)

        return NextResponse.json({ history: serializeBigInt(history) })
    } catch (error) {
        console.error('Error in POST request:', error)
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
    }
}