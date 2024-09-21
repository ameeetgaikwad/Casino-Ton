import { NextRequest, NextResponse } from "next/server";
import { users } from "@/drizzle/schema"

import { eq } from 'drizzle-orm'
import { createAndSendToken } from "@/middlewares/authMiddlewares";
import { db } from "@/drizzle/db";

export async function POST(request: NextRequest) {
    try {
        const { address } = await request.json()
        const user = await db.select().from(users).where(eq(users.address, address)).limit(1)

        if (!user[0]) {
            const user = await db.insert(users).values({ address: address })
            const token = createAndSendToken(user[0])
            console.log(user[0])
            return NextResponse.json({ token })
        }

        const token = createAndSendToken(user[0])

        return NextResponse.json({ token })
    } catch (error) {
        console.error('Error in POST request:', error)
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
    }
}