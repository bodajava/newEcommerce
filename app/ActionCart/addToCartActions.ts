"use server"

import getMyToken from "@/app/util/getMyToken";


export default async function addToCart(id: string) {
  try {
    const token = await getMyToken();

    if (!token) {
      return {
        status: "error",
        message: "Please login to access this feature"
      };
    }

    const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
      method: "POST",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: id }),
    });

    const payload = await res.json();

    // Check if the API returned an error in the response
    if (!res.ok || payload.status === "error" || (payload.message && !payload.message.includes('success'))) {
      return {
        status: "error",
        message: payload.message || `HTTP error! status: ${res.status}`
      };
    }

    // If API returns success or the message contains success
    return {
      status: "success",
      data: payload,
      message: payload.message
    };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Failed to add product to cart"
    };
  }
}