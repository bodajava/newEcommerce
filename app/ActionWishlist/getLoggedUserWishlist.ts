"use server"

import getMyToken from "../util/getMyToken";

export default async function getLoggedUserWishlist() {
    try {
        const token = await getMyToken();
        if (!token) return { status: "error", message: "User not authenticated" };

        const res = await fetch(`${process.env.API}/wishlist`, {
            method: 'GET',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in getLoggedUserWishlist:", error);
        return { status: "error", message: "Failed to fetch wishlist" };
    }
}
