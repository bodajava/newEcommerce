"use server"

import getMyToken from "../util/getMyToken";

export default async function verifyToken() {
    try {
        const token = await getMyToken();
        if (!token) return { status: "error", message: "Token not found" };

        const res = await fetch(`${process.env.API}/auth/verifyToken`, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in verifyToken:", error);
        return { status: "error", message: "Failed to verify token" };
    }
}
