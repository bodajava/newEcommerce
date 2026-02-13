"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Button from '@/app/-Components/ButtonAddToCart';
import Link from 'next/link';
import ProductCard from '@/app/-Components/ProductCard';

interface Product {
    _id: string;
    id: string;
    title: string;
    description: string;
    price: number;
    priceAfterDiscount?: number;
    imageCover: string;
    ratingsAverage: number;
    ratingsQuantity: number;
    quantity: number;
    brand?: { name: string };
    category?: { name: string; _id: string };
}

export default function ProductDetailsUI({
    data,
    relatedProducts
}: {
    data: Product;
    relatedProducts: Product[]
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const relatedRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(imageRef.current, {
            x: -50,
            opacity: 0,
            duration: 1,
        })
            .from(contentRef.current?.children || [], {
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
            }, "-=0.5")
            .from(relatedRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
            }, "-=0.5");
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white pt-24 md:pt-32 pb-20 px-4 sm:px-6 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Main Product Section */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-20 md:mb-32">
                    {/* Image Section */}
                    <div ref={imageRef} className="relative group w-full max-w-2xl mx-auto lg:mx-0">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#111] border border-white/10">
                            <Image
                                src={data.imageCover}
                                alt={data.title}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-110 "
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                unoptimized
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div ref={contentRef} className="flex flex-col space-y-6 sm:space-y-8 mt-8 lg:mt-0">
                        <div className="space-y-4 text-left">
                            {data.category && (
                                <span className="inline-block px-4 py-1 text-xs sm:text-sm font-medium bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                                    {data.category.name}
                                </span>
                            )}
                            <h1 className="text-xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                                {data.title}
                            </h1>
                            {data.brand && (
                                <p className="text-lg sm:text-xl text-gray-400">by <span className="text-white font-medium">{data.brand.name}</span></p>
                            )}
                        </div>

                        {/* Ratings */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(data.ratingsAverage) ? 'fill-current' : 'text-gray-600 fill-current'}`}
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm sm:text-base text-gray-400">
                                <span className="text-white font-bold">{data.ratingsAverage}</span> ({data.ratingsQuantity} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="py-6 border-y border-white/10">
                            <div className="flex items-baseline gap-3 flex-wrap">
                                <span className="text-3xl sm:text-5xl font-extrabold text-white">
                                    {data.priceAfterDiscount || data.price} <span className="text-lg sm:text-2xl font-normal text-gray-400 ml-1">EGP</span>
                                </span>
                                {data.priceAfterDiscount && data.priceAfterDiscount < data.price && (
                                    <span className="text-lg sm:text-2xl text-gray-500 line-through">
                                        {data.price} EGP
                                    </span>
                                )}
                            </div>
                            {data.priceAfterDiscount && data.priceAfterDiscount < data.price && (
                                <div className="mt-2">
                                    <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs sm:text-sm font-bold border border-red-500/20">
                                        Save {((data.price - data.priceAfterDiscount) / data.price * 100).toFixed(0)}% OFF
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Product Description</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                {data.description}
                            </p>
                        </div>

                        {/* Stock */}
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${data.quantity > 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                            <p className={`text-sm sm:text-base font-medium ${data.quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {data.quantity > 0 ? `${data.quantity} items available in stock` : 'Currently out of stock'}
                            </p>
                        </div>

                        {/* Add to Cart */}
                        <div className="pt-4">
                            <Button id={data.id} />
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div ref={relatedRef} className="space-y-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Related Products</h2>
                            <div className="h-px flex-grow mx-8 bg-gradient-to-r from-white/20 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                            {relatedProducts.slice(0, 4).map((product) => (
                                <ProductCard key={product._id} item={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
