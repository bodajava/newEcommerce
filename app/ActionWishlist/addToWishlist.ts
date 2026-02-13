"use server"

import getMyToken from "../util/getMyToken";

export default async function addToWishlist(productId: string) {
    try {
        const token = await getMyToken();
        if (!token) return { status: "error", message: "User not authenticated" };

        const res = await fetch(`${process.env.API}/wishlist`, {
            method: 'POST',
            headers: {
                'token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in addToWishlist:", error);
        return { status: "error", message: "Failed to add product to wishlist" };
    }
}
