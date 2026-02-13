"use server"

export default async function getAllSubcategories() {
    try {
        const res = await fetch(`${process.env.API}/subcategories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in getAllSubcategories:", error);
        return { status: "error", message: "Failed to fetch subcategories" };
    }
}
