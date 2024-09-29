import { NextRequest, NextResponse } from "next/server";
import { users } from "@/drizzle/schema"

import { eq } from 'drizzle-orm'
import { createAndSendToken, protect } from "@/middlewares/authMiddlewares";
import { db } from "@/drizzle/db";

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.replace("Bearer ", "");


        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }
        const user = await protect(token)
        if (!user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        return NextResponse.json({ token })
    } catch (error) {
        console.error('Error in POST request:', error)
        return NextResponse.json({ error: 'An error occurred' }, { status: 401 })
    }
}