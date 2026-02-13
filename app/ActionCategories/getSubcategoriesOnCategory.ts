"use server"

export default async function getSubcategoriesOnCategory(categoryId: string) {
    try {
        const res = await fetch(`${process.env.API}/categories/${categoryId}/subcategories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in getSubcategoriesOnCategory:", error);
        return { status: "error", message: "Failed to fetch subcategories for category" };
    }
}
