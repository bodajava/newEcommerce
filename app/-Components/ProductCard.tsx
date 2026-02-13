"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Button from './ButtonAddToCart';
import { Heart } from 'lucide-react';
import { useWishlist } from '../Context/WishlistContext';
import { useToast } from '@/components/ui/toaster';

interface Product {
    _id: string;
    id?: string;
    title: string;
    description: string;
    price: number;
    imageCover: string;
}

interface BentoTiltProps {
    children: React.ReactNode;
    className?: string;
}

const BentoTilt = ({ children, className = "" }: BentoTiltProps) => {
    const [transformStyle, setTransformStyle] = useState("");
    const itemRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!itemRef.current) return;

        const { left, top, width, height } = itemRef.current.getBoundingClientRect();

        const relativeX = (e.clientX - left) / width;
        const relativeY = (e.clientY - top) / height;
        const tiltX = (relativeY - 0.5) * 10;
        const tiltY = (relativeX - 0.5) * -10;
        const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;

        setTransformStyle(newTransform);
    };

    const handleMouseLeave = () => {
        setTransformStyle("");
    };

    return (
        <div
            ref={itemRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: transformStyle, transition: 'transform 0.1s ease-out' }}
        >
            {children}
        </div>
    );
};

export default function ProductCard({ item }: { item: Product }) {
    const productId = item._id || item.id;
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { toast } = useToast();
    const [isWishlisting, setIsWishlisting] = useState(false);

    const isFav = isInWishlist(productId!);

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsWishlisting(true);
        try {
            if (isFav) {
                const res = await removeFromWishlist(productId!) as any;
                if (res && res.status === 'success') {
                    toast({ title: "Removed", description: "Product removed from wishlist", variant: "default" });
                }
            } else {
                const res = await addToWishlist(productId!) as any;
                if (res && res.status === 'success') {
                    toast({ title: "Added", description: "Product added to wishlist", variant: "success" });
                } else if (res && res.status === 'error') {
                    toast({ title: "Error", description: res.message, variant: "destructive" });
                }
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update wishlist", variant: "destructive" });
        } finally {
            setIsWishlisting(false);
        }
    };

    return (
        <BentoTilt className="h-full">
            <div
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 flex flex-col h-full"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Love Button (Heart) */}
                <button
                    onClick={toggleWishlist}
                    disabled={isWishlisting}
                    className={`absolute top-4 left-4 z-20 p-3 rounded-full backdrop-blur-md bg-black/20 border border-white/10 transition-all duration-300 hover:scale-110 active:scale-95 group/heart ${isFav ? 'bg-red-500/20 border-red-500/40' : ''}`}
                >
                    <Heart
                        size={20}
                        className={`transition-colors duration-300 ${isFav ? 'fill-red-500 text-red-500' : 'text-white group-hover/heart:text-red-400'}`}
                    />
                    {isWishlisting && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                </button>

                {/* Link for Image and Title */}
                <Link
                    href={`/Products/${productId}`}
                    className="cursor-pointer"
                >
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-gray-800/50 h-56 sm:h-64">
                        <img
                            src={item.imageCover}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-4 py-2 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            {item.price} EGP
                        </div>
                    </div>
                </Link>

                {/* Content */}
                <div className="relative p-6 space-y-4 flex-grow flex flex-col">
                    <Link href={`/Products/${productId}`} className="cursor-pointer">
                        <h2 className="text-xl font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
                            {item.title}
                        </h2>

                        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed mt-2">
                            {item.description}
                        </p>
                    </Link>

                    {/* Action Button - Outside Link */}
                    <div className="pt-4 mt-auto">
                        <Button id={productId!} />
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
            </div>
        </BentoTilt>
    );
}
