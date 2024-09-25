import { NextRequest, NextResponse } from "next/server";
import { serializeBigInt, users } from "@/drizzle/schema"

import { eq } from 'drizzle-orm'
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

        const balance = await db.select().from(users).where(eq(users.address, user.address)).limit(1)

        return NextResponse.json({ balance: serializeBigInt(balance[0].balance) })
    } catch (error) {
        console.error('Error in POST request:', error)
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
    }
}