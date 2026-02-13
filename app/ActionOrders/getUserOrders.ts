"use server"
import getMyToken from "../util/getMyToken"

export async function getUserOrders(userId: string) {
    const token = await getMyToken();

    if (!token) {
        return { status: "error", message: "You are not logged in" };
    }

    try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`, {
            method: 'GET',
            headers: {
                token,
            },
            next: { revalidate: 60 } // Cache for 1 minute
        });

        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error(`[getUserOrders] API Error ${res.status}:`, text);
            return { status: "error", message: `API Error ${res.status}` };
        }

        const data = await res.json();
        return { status: "success", data };
    } catch (error) {
        console.error("Error in getUserOrders:", error);
        return { status: "error", message: "Network error or invalid server response" };
    }
}
