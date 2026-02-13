"use server"
import getMyToken from "../util/getMyToken"

export async function createCheckoutSession(cartId: string, baseUrl: string, shippingAddress: { details: string, phone: string, city: string }) {
    const token = await getMyToken();

    if (!token) throw new Error("You are not logged in");

    try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${baseUrl}`, {
            method: 'POST',
            headers: {
                token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ shippingAddress }),
        });

        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error(`[createCheckoutSession] API Error ${res.status}:`, text);
            return { status: "error", message: `API Error ${res.status}` };
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in createCheckoutSession:", error);
        return { status: "error", message: "Network error or invalid server response" };
    }
}
