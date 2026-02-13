"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import getSpecificCategory from '../../ActionCategories/getSpecificCategory';
import getAllProduct from '../../-Components/ProductAPI/getAllProduct.api';
import ProductCard from '../../-Components/ProductCard';
import { LayoutGrid, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CategoryProducts() {
    const { id } = useParams();
    const [category, setCategory] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [catRes, prodRes] = await Promise.all([
                    getSpecificCategory(id as string),
                    getAllProduct(id as string)
                ]);

                if (catRes.data) setCategory(catRes.data);
                if (prodRes) setProducts(prodRes);
            } catch (error) {
                console.error("Error fetching category data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#030303] pt-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="h-12 w-48 bg-gray-900 animate-pulse rounded-xl mb-8" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="h-96 rounded-3xl bg-gray-900 animate-pulse border border-gray-800" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030303] pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs / Back */}
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/Categories" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} /> Back to Categories
                    </Link>
                    <div className="text-gray-500 text-sm hidden sm:block">
                        Showing {products.length} products in {category?.name}
                    </div>
                </div>

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-white flex items-center gap-4">
                        {category?.name} <LayoutGrid className="text-blue-500" size={32} />
                    </h1>
                    <div className="w-24 h-1 bg-blue-600 mt-4 rounded-full" />
                </div>

                {/* Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((item) => (
                            <ProductCard key={item._id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center text-gray-500">
                        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6">
                            <LayoutGrid size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">No products found</h2>
                        <p className="mt-2">We couldn't find any products in this category at the moment.</p>
                        <Link href="/Products" className="mt-8 btn inline-block">
                            Browse All Products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
