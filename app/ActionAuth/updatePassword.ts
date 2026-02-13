"use server"

import getMyToken from "../util/getMyToken";

export default async function updatePassword(passwords: { currentPassword: string; password: string; rePassword: string }) {
    try {
        const token = await getMyToken();
        if (!token) return { status: "error", message: "User not authenticated" };

        const res = await fetch(`${process.env.API}/users/changeMyPassword`, {
            method: 'PUT',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(passwords),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in updatePassword:", error);
        return { status: "error", message: "Failed to update password" };
    }
}
