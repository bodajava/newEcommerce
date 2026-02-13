"use client"
import React, { useEffect, useState } from 'react'
import getLogedUser from '../ActionCart/getLogedUserCaer'
import { removeAllCart } from '../ActionCart/removeAllCart.action'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toaster'
import deleteItemCartt from '../ActionCart/deleteItemCart.Ction'
import updateCartAction from '../ActionCart/updateCart.Action'
import { useCart } from '../Context/CartContext'

export default function Cart() {
  const { toast } = useToast()
  const router = useRouter()
  const { updateCartCount } = useCart()
  const [cartData, setCartData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showData, setShowData] = useState(false)
  const [clearAllCartLoading, setClearAllCartLoading] = useState(false)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  // Synchronization: sync local cartData changes with the global CartContext
  useEffect(() => {
    if (cartData) {
      updateCartCount(cartData)
    }
  }, [cartData, updateCartCount])

  async function update(id: string, count: number) {
    if (count < 1) {
      toast({
        title: "Error",
        description: "Quantity cannot be less than 1.",
        variant: "destructive"
      });
      return;
    }

    try {
      setUpdatingItems(prev => new Set(prev).add(id))

      setCartData((prev: any) => {
        if (!prev?.data?.products) return prev

        const updatedProducts = prev.data.products.map((product: any) => {
          if (product._id === id) {
            return {
              ...product,
              count: count,
              price: (product.price / product.count) * count
            }
          }
          return product
        })

        return {
          ...prev,
          data: {
            ...prev.data,
            products: updatedProducts
          }
        }
      })

      const res = await updateCartAction(id, count)

      if (res.status === 'success' || res.statusMsg === 'success') {
        if (res.data) {
          setCartData((prev: any) => ({
            ...prev,
            data: res.data
          }))
        }
      }

    } catch (err: any) {
      // Error handling if needed
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  async function deleteItemCartActionnction(id: string) {
    try {
      setRemovingItems(prev => new Set(prev).add(id))

      const res = await deleteItemCartt(id)

      if (res.status === 'success') {
        toast({
          title: "Success!",
          description: "Item has been successfully removed from the cart.",
          variant: "success"
        });

        setCartData((prev: any) => {
          if (!prev?.data?.products) return prev

          const updatedProducts = prev.data.products.filter((product: any) => product._id !== id)

          if (updatedProducts.length === 0) {
            setShowData(false)
          }

          return {
            ...prev,
            data: {
              ...prev.data,
              products: updatedProducts
            }
          }
        })
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to remove item.",
          variant: "destructive"
        });
      }

    } catch (err: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  async function removeAllCartAction() {
    try {
      setClearAllCartLoading(true)
      const res = await removeAllCart();

      if (res.status === 'success' || res.message === 'success') {
        toast({
          title: "Success!",
          description: "All items have been successfully removed from the cart.",
          variant: "success"
        });
        setCartData({
          status: 'success',
          data: {
            products: [],
            totalCartPrice: 0
          }
        });
        updateCartCount(null);
        setShowData(false);
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to clear cart.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setClearAllCartLoading(false)
    }
  }

  async function getUserCart() {
    try {
      setIsLoading(true)
      const data = await getLogedUser()
      setCartData(data)

      setTimeout(() => {
        setIsLoading(false)
        setTimeout(() => {
          setShowData(true)
        }, 100)
      }, 500)

    } catch (error) {
      console.log(error)
      setIsLoading(false)
      setCartData(null)
      updateCartCount(null)
    }
  }

  useEffect(() => {
    getUserCart()
  }, [])

  return (
    <div className="max-w-7xl mx-auto pt-10 px-4 md:px-0 my-20">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50">
        <div className="overflow-x-auto w-full">
          <table className="w-full table-auto">
            <thead className="bg-gray-900/80 border-b border-gray-700">
              <tr>
                <th className="min-w-[150px] px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Product</th>
                <th className="min-w-[150px] px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase">Quantity</th>
                <th className="min-w-[150px] px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase">Price</th>
                <th className="min-w-[150px] px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700/50">
              {!isLoading && cartData?.data?.products?.length > 0 ? (
                cartData.data.products.map((product: any, index: number) => (
                  <tr
                    key={product._id}
                    className={`group hover:bg-gray-700/30 transition-all cart-item-fade-in`}
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {/* Product */}
                    <td className="min-w-[150px] px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-700">
                          <img
                            src={product.product.imageCover}
                            className="w-full h-full object-cover"
                            alt={product.product.title}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-base md:text-lg truncate">
                            {product.product.title}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">
                            Item #{product._id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="min-w-[150px] px-6 py-6 text-center">
                      <div className="inline-flex items-center gap-3 bg-gray-900/50 rounded-full px-4 py-2 border border-gray-600">
                        <button
                          onClick={() => update(product._id, product.count - 1)}
                          disabled={updatingItems.has(product._id) || product.count <= 1}
                          className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingItems.has(product._id) ? (
                            <svg className="animate-spin h-4 w-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          )}
                        </button>

                        <span className="text-white font-semibold text-lg">{product.count}</span>

                        <button
                          onClick={() => update(product._id, product.count + 1)}
                          disabled={updatingItems.has(product._id)}
                          className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingItems.has(product._id) ? (
                            <svg className="animate-spin h-4 w-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="min-w-[150px] px-6 py-6 text-right">
                      <div className="text-2xl font-bold text-white">
                        {product.price} EGP
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {(product.price / product.count).toFixed(2)} EGP each
                      </div>
                    </td>

                    {/* Action */}
                    <td className="min-w-[150px] px-6 py-6 text-center">
                      <button
                        disabled={removingItems.has(product._id)}
                        onClick={() => deleteItemCartActionnction(product._id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition border border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {removingItems.has(product._id) ? (
                          <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Removing...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12">
                    <div className="dot-spinner text-center flex items-center justify-center h-full mx-auto">
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                      <div className="dot-spinner__dot"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-gray-400 text-lg font-light">Your cart is empty</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        {!isLoading && cartData?.data?.products?.length > 0 && showData && (
          <div className="border-t border-gray-700/50 bg-gray-900/50 px-6 py-6 cart-summary-fade-in">
            <div className="max-w-md ml-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-lg">Subtotal:</span>
                <span className="text-2xl font-bold text-white">
                  {cartData.data.products.reduce((sum: number, p: any) => sum + p.price, 0).toFixed(2)} EGP
                </span>
              </div>

              <div className="flex gap-5">
                <button
                  onClick={() => router.push('/Checkout')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed text-center"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => removeAllCartAction()}
                  disabled={clearAllCartLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {clearAllCartLoading ? 'Clearing...' : 'Clear all Cart'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
