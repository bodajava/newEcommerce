"use server"

import getMyToken from "../util/getMyToken";

export default async function removeFromWishlist(productId: string) {
    try {
        const token = await getMyToken();
        if (!token) return { status: "error", message: "User not authenticated" };

        const res = await fetch(`${process.env.API}/wishlist/${productId}`, {
            method: 'DELETE',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in removeFromWishlist:", error);
        return { status: "error", message: "Failed to remove product from wishlist" };
    }
}
