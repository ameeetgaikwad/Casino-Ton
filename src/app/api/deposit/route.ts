import { NextRequest, NextResponse } from "next/server";
import { deposits, users } from "@/drizzle/schema"

import { eq } from 'drizzle-orm'
import { createAndSendToken, protect } from "@/middlewares/authMiddlewares";
import { db } from "@/drizzle/db";

export async function POST(request: NextRequest) {
    const { uuid } = await request.json();
    console.log("POST request received", uuid);
    const token = request.headers.get('Authorization')?.replace("Bearer ", "");

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    const user = await protect(token)

    if (!user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const result = await db.insert(deposits).values({ tId: uuid }).returning()
    return NextResponse.json(result);
}