"use server"

export default async function getAllCategories() {
    try {
        const res = await fetch(`${process.env.API}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in getAllCategories:", error);
        return { status: "error", message: "Failed to fetch categories" };
    }
}
