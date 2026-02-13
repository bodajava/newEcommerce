"use server";

import { cookies } from "next/headers"
import { decode } from "next-auth/jwt"

export default async function getMyToken() {
    const start = Date.now();
    try {
        const cookieStore = await cookies();
        const decodeToken =
            cookieStore.get('next-auth.session-token')?.value ||
            cookieStore.get('__Secure-next-auth.session-token')?.value;

        if (!decodeToken) {
            return null;
        }

        const token = await decode({
            token: decodeToken,
            secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET!
        });

        const end = Date.now();
        if (end - start > 1000) {
            console.warn(`[getMyToken] Warning: Token decoding took ${end - start}ms`);
        }

        return (token?.token as string) || null;
    } catch (error) {
        console.error("[getMyToken] Error:", error);
        return null;
    }
}