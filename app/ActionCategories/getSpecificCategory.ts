"use server"

export default async function getSpecificCategory(id: string) {
    try {
        const res = await fetch(`${process.env.API}/categories/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in getSpecificCategory:", error);
        return { status: "error", message: "Failed to fetch specific category" };
    }
}
