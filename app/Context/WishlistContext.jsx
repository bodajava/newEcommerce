"use client"
import { createContext, useEffect, useState, useContext } from "react";
import { useSession } from "next-auth/react";
import getLoggedUserWishlist from "../ActionWishlist/getLoggedUserWishlist";
import addToWishlistAction from "../ActionWishlist/addToWishlist";
import removeFromWishlistAction from "../ActionWishlist/removeFromWishlist";

export const WishlistContext = createContext({
    wishlistItems: [],
    wishlistCount: 0,
    addToWishlist: (productId) => { },
    removeFromWishlist: (productId) => { },
    isInWishlist: (productId) => false,
    syncWishlist: () => { }
})

export default function WishlistProvider({ children }) {
    const { status } = useSession();
    const [wishlistItems, setWishlistItems] = useState([])
    const [wishlistCount, setWishlistCount] = useState(0)

    async function syncWishlist() {
        if (status !== "authenticated") return;
        try {
            const res = await getLoggedUserWishlist()
            if (res.status === "success") {
                setWishlistItems(res.data)
                setWishlistCount(res.count || res.data.length)
            }
        } catch (error) {
            console.error("Error syncing wishlist:", error)
        }
    }

    async function addToWishlist(productId) {
        if (status !== "authenticated") return { status: "error", message: "Please login first" };
        try {
            const res = await addToWishlistAction(productId)
            if (res.status === "success") {
                await syncWishlist()
            }
            return res
        } catch (error) {
            return { status: "error", message: "Something went wrong" }
        }
    }

    async function removeFromWishlist(productId) {
        if (status !== "authenticated") return { status: "error", message: "Please login first" };
        try {
            const res = await removeFromWishlistAction(productId)
            if (res.status === "success") {
                await syncWishlist()
            }
            return res
        } catch (error) {
            return { status: "error", message: "Something went wrong" }
        }
    }

    function isInWishlist(productId) {
        return wishlistItems.some(item => (item._id || item.id) === productId)
    }

    useEffect(() => {
        if (status === "authenticated") {
            syncWishlist()
        } else if (status === "unauthenticated") {
            setWishlistItems([])
            setWishlistCount(0)
        }
    }, [status])

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            wishlistCount,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            syncWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext)
    if (!context) {
        throw new Error("useWishlist must be used within WishlistProvider")
    }
    return context
}
