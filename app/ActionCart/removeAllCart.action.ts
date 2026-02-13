import getMyToken from "../util/getMyToken"

export async function removeAllCart() {
    const token = await getMyToken();

    if (!token) throw new Error("You are not logged in");

    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart`, {
        method: 'DELETE',
        headers: {
            token,
            "Content-Type": "application/json",
        },
    });
    return res.json();
}