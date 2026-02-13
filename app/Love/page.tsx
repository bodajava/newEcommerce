"use client";

import React from 'react';
import { useWishlist } from '../Context/WishlistContext';
import ProductCard from '../-Components/ProductCard';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';

export default function Love() {
  const { wishlistItems, wishlistCount } = useWishlist();

  return (
    <div className="min-h-screen bg-[#030303] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-3">
              My Wishlist <Heart className="text-red-500 fill-red-500 animate-pulse" size={32} />
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              You have {wishlistCount} items saved in your collection.
            </p>
          </div>

          <Link
            href="/Products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform duration-300"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Grid */}
        {wishlistCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((item: any) => (
              <div key={item._id || item.id} className="h-full">
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
            <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
              <Heart size={40} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Your wishlist is empty</h2>
              <p className="text-gray-400 mt-2">Start adding products you love to see them here!</p>
            </div>
            <Link
              href="/Products"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-all"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
