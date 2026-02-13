"use client"
import React, { useEffect, useState } from 'react'
import getAllCategories from '../ActionCategories/getAllCategories'
import Link from 'next/link'
import { LayoutGrid, ChevronRight, Sparkles } from 'lucide-react'

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories()
        if (res.data) {
          setCategories(res.data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen bg-[#030303] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
          <Sparkles size={14} />
          <span>Explore All Collections</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
          Shop by <span className="text-blue-500">Categories</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Find exactly what you're looking for by browsing through our carefully curated collections.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-gray-900 animate-pulse border border-gray-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category: any) => (
            <Link
              key={category._id}
              href={`/Categories/${category._id}`}
              className="group relative overflow-hidden rounded-3xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition-all duration-500"
            >
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

              <img
                src={category.image}
                className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700"
                alt={category.name}
              />

              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2 flex items-center gap-1">
                      View Collection <ChevronRight size={14} />
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
                    <LayoutGrid className="text-white" size={20} />
                  </div>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl -z-10" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
