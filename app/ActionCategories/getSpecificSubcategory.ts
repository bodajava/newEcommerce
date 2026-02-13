"use server"

export default async function getSpecificSubcategory(id: string) {
    try {
        const res = await fetch(`${process.env.API}/subcategories/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in getSpecificSubcategory:", error);
        return { status: "error", message: "Failed to fetch specific subcategory" };
    }
}
