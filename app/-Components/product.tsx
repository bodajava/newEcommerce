"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Button from './ButtonAddToCart';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageCover: string;
}

import ProductCard from './ProductCard';

export default function ProductsComponent({ data }: { data: Product[] }) {
  return <>
    <div className="min-h-screen bg-gradient-to-br text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            Discover Our Products
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our curated collection of premium products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
          {data.map((item: Product) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>

        {/* Empty State */}
        {data.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-gray-800/50 rounded-3xl border border-gray-700/50">
              <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No Products Found</h3>
              <p className="text-gray-500">Check back later for amazing deals!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </>
}
