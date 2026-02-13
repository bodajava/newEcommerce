"use client"
import React, { useEffect, useState } from "react"
import getAllBrands from "../ActionBrands/getAllBrands"

// ====== Type ======
export interface Brand {
  id: number
  name: string
  image?: string | null
  description?: string | null
  productsCount?: number
}

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchBrands() {
    try {
      setLoading(true)

      const data = await getAllBrands()
      console.log("API DATA => ", data)

      const finalData =
        Array.isArray(data)
          ? data
          : data?.data && Array.isArray(data.data)
          ? data.data
          : data?.brands && Array.isArray(data.brands)
          ? data.brands
          : []

      setBrands(finalData)
    } catch (error) {
      console.error("Error fetching brands:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e0e10]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white py-12 bg-[#0e0e10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h1
          className="
            relative 
            text-4xl 
            font-bold 
            mb-10 
            mt-10 
            flex 
            flex-col 
            items-center 
            justify-center
            after:content-[''] 
            after:w-24 
            after:h-[3px] 
            after:bg-blue-500 
            after:mt-2
          "
        >
          All Brands
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="cursor-pointer group relative bg-[#1a1a1d] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#2a2a2d] hover:border-[#3a3a3d]"
            >
              {/* Image wrapper */}
              <div className="rounded-xl aspect-square bg-[#151518] p-6 flex items-center justify-center overflow-hidden">
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full rounded-xl object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-slate-600 group-hover:text-slate-300 transition-colors">
                      {brand.name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-xl text-slate-200 group-hover:text-white transition-colors mb-2">
                  {brand.name}
                </h3>

                {brand.description && (
                  <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                    {brand.description}
                  </p>
                )}

                {brand.productsCount !== undefined && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>{brand.productsCount} Products</span>
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {brands.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-4"></div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">No Brands Found</h3>
            <p className="text-gray-500">There are no brands available at the moment</p>
          </div>
        )}
      </div>
    </div>
  )
}
