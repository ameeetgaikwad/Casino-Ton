import { AppConfig } from '@/config/appConfig';
import { db } from '@/drizzle/db';
import { User, users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server';

const signToken = (id) => {
    return jwt.sign({ id }, AppConfig.jwt.secret, {
        expiresIn: AppConfig.jwt.expiry,
    });
};

export const createAndSendToken = (user: User) => {
    const token = signToken(user.id);

    return token
    // const cookieOptions = {
    //     expires: new Date(
    //         Date.now() + AppConfig.jwt.cookieExpiry * 24 * 60 * 60 * 1000
    //     ),
    //     httpOnly: true,
    //     secure: false,
    // };
    // // for https only
    // if (AppConfig.env === 'production') cookieOptions.secure = true;

    // res.cookie('jwt', token, cookieOptions);

};

// export const verifyJwt = async (token: string) => {
//     const decoded = jwt.verify(token, AppConfig.jwt.secret);

//     return decoded
// }

export const protect = async (token: string) => {
    try {
        if (!token) {
            console.log('No token provided')
            return null
        }

        // 2) Verification token

        const decoded = jwt.verify(token, AppConfig.jwt.secret);

        // 3) Check if token is already expired
        if (typeof decoded !== 'string' && decoded.exp && decoded.exp * 1000 < Date.now()) {
            console.log('Token is expired. Please login again.')
            return null
        }

        // 3) Check if user still exists
        const freshUser = await db.select().from(users).where(eq(users.id, (decoded as { id: string }).id)).limit(1);
        if (!freshUser.length) {
            return null
        }
        const user = freshUser[0];

        return user
    } catch (error) {
        console.log('Error in protect middleware', error)
        return null
    }
};

export const protectAdmin = async (token: string, password: string) => {
    try {
        if (!token) {
            console.log('No token provided')
            return null
        }
        if (password !== process.env.ADMIN_PASSWORD) {
            console.log('Invalid admin password')
            return null
        }

        // 2) Verification token

        const decoded = jwt.verify(token, AppConfig.jwt.secret);

        // 3) Check if token is already expired
        if (typeof decoded !== 'string' && decoded.exp && decoded.exp * 1000 < Date.now()) {
            console.log('Token is expired. Please login again.')
            return null
        }

        // 3) Check if user still exists
        const freshUser = await db.select().from(users).where(eq(users.id, (decoded as { id: string }).id)).limit(1);
        if (!freshUser.length) {
            return null
        }
        const user = freshUser[0];

        return user
    } catch (error) {
        console.log('Error in protect middleware', error)
        return null
    }
};