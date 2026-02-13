"use server"

export default async function SelectTheProducts(id: string) {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return null;
    }
    
    const { data } = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}