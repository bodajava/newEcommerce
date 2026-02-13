"use client"
import React, { useState, useEffect } from 'react'
import addToCart from '../ActionButton/addToCartActions'
import { useToast } from '@/components/ui/toaster'
import { useCart } from '../Context/CartContext'

export default function Button({ id }: { id: string }) {
  const { toast } = useToast()
  const { updateCartCount } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  async function checkToAddCart(productId: string) {
    setIsLoading(true)

    try {
      const res = await addToCart(productId)

      if (res.status === 'success' || (res.status === 'fail' && res.message?.includes('success'))) {
        toast({
          title: "Success!",
          description: "Product added to cart successfully",
          variant: "success"
        })

        // Notify CartContext to update the count globally
        if (res.data) {
          updateCartCount(res.data)
        }
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to add product to cart. Please try again",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={() => checkToAddCart(id)}
      disabled={isLoading}
      className="group relative w-full py-5 px-8 bg-[#FFD700] hover:bg-[#FFC400] text-black rounded-2xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_30px_rgb(255,215,0,0.2)] hover:shadow-[0_8px_30px_rgb(255,215,0,0.4)] border border-black/5 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {isLoading ? (
        <span className="flex items-center justify-center gap-3 font-bold tracking-tight text-lg">
          <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          PROCESS...
        </span>
      ) : (
        <span className="relative z-10 font-black tracking-[0.12em] text-base sm:text-lg uppercase">
          Add To Cart
        </span>
      )}
    </button>
  )
}
