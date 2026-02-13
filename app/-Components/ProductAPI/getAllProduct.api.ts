"use server"

export default async function getAllProduct(categoryId?: string) {
    const url = categoryId
        ? `https://ecommerce.routemisr.com/api/v1/products?category[in]=${categoryId}`
        : `https://ecommerce.routemisr.com/api/v1/products`;

    try {
        const res = await fetch(url);
        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error("Error in getAllProduct:", error);
        return [];
    }
}
