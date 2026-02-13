"use client"
import { createContext, useEffect, useState, useContext } from "react";
import { useSession } from "next-auth/react";
import getLogedUser from "../ActionCart/getLogedUserCaer";

export const CartContext = createContext({
    numberOfCartItem: 0,
    setnumberOfCartItem: () => { },
    updateCartCount: (cartData) => { }
})

export default function CartProvider({ children }) {
    const { status } = useSession();
    const [numberOfCartItem, setnumberOfCartItem] = useState(0)

    async function getUserCart() {
        if (status !== "authenticated") return;
        try {
            let sum = 0;
            const res = await getLogedUser()
            if (res.status === "success") {
                res.data.products.forEach((product) => {
                    sum += product.count
                })

            }
            setnumberOfCartItem(sum)
        } catch (error) {
            console.log(error)
            setnumberOfCartItem(0)
        }
    }

    function updateCartCount(cartData) {
        if (!cartData?.data?.products) {
            setnumberOfCartItem(0)
            return
        }
        let sum = 0
        cartData.data.products.forEach((product) => {
            sum += product.count
        })
        setnumberOfCartItem(sum)
    }

    useEffect(() => {
        if (status === "authenticated") {
            getUserCart()
        } else if (status === "unauthenticated") {
            setnumberOfCartItem(0)
        }
    }, [status])

    return (
        <CartContext.Provider value={{ numberOfCartItem, setnumberOfCartItem, updateCartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within CartProvider")
    }
    return context
}
