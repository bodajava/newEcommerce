"use client";

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { getUserOrders } from '../ActionOrders/getUserOrders';
import { CheckCircle2, Clock, Package, ShoppingBag, ArrowRight, ExternalLink } from 'lucide-react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function AllOrders() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchOrders() {
            if (status === 'authenticated' && (session as any)?.token) {
                const userId = (session?.user as any)?.id || "6407cf6f515bdcf347c09f17";

                const res = await getUserOrders(userId);
                if (res.status === "success") {
                    setOrders(res.data);
                    // Animation after data loads
                    gsap.from(".order-card", {
                        y: 30,
                        opacity: 0,
                        stagger: 0.1,
                        duration: 0.6,
                        ease: "power2.out",
                        delay: 0.2
                    });
                }
            }
            setIsLoading(false);
        }

        if (status !== 'loading') {
            fetchOrders();
        }
    }, [status, session]);

    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
                <div className="bg-gray-800/30 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 text-center max-w-md w-full shadow-2xl">
                    <ShoppingBag className="w-16 h-16 text-blue-400 mx-auto mb-6 opacity-20" />
                    <h2 className="text-2xl font-bold text-white mb-4">Please Sign In</h2>
                    <p className="text-gray-400 mb-8">You need to be logged in to view your order history.</p>
                    <Link href="/Login" className="inline-block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all">
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-blue-400/60 animate-pulse text-sm">Fetching your orders history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black py-24 px-4 sm:px-6 lg:px-8">
            <div ref={containerRef} className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">My Orders</h1>
                        <p className="text-gray-400">Track and manage your recent purchases</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 text-sm font-medium">
                        <Package className="w-4 h-4" />
                        {orders.length} Orders
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-gray-800/20 backdrop-blur-lg rounded-3xl p-12 border border-gray-700/50 text-center shadow-2xl">
                        <div className="w-20 h-20 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
                        <p className="text-gray-400 mb-8 max-w-sm mx-auto">Looks like you haven't placed any orders yet. Start shopping to fill your history!</p>
                        <Link href="/Products" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-all">
                            Browse Products <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order: any) => (
                            <div key={order._id} className="order-card bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700/50 overflow-hidden hover:border-blue-500/30 transition-all shadow-xl group">
                                <div className="p-6 sm:p-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                                                <Package className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Order ID</p>
                                                <h3 className="text-white font-bold text-sm sm:text-base">#{order._id.slice(-8).toUpperCase()}</h3>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${order.isPaid ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                }`}>
                                                {order.isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {order.isPaid ? 'Paid' : 'Pending Payment'}
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${order.isDelivered ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                                }`}>
                                                {order.isDelivered ? 'Delivered' : 'In Transit'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="md:col-span-2 space-y-4">
                                            <p className="text-gray-400 text-sm font-medium">Items</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {order.cartItems.map((item: any) => (
                                                    <div key={item._id} className="flex gap-4 p-3 bg-gray-900/40 rounded-2xl border border-gray-800/50 group-hover:bg-gray-900/60 transition-colors">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700/30">
                                                            <img src={item.product.imageCover} alt={item.product.title} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-white text-xs font-semibold truncate mb-1">{item.product.title}</h4>
                                                            <p className="text-gray-500 text-[10px] font-medium uppercase tracking-tighter">Qty: {item.count}</p>
                                                            <p className="text-blue-400 text-xs font-bold mt-1">{item.price} EGP</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <p className="text-gray-400 text-sm font-medium">Summary</p>
                                                <div className="bg-gray-900/40 rounded-2xl p-6 border border-gray-800/50 space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Payment Method</span>
                                                        <span className="text-white font-medium">{order.paymentMethodType === 'card' ? 'Online Card' : 'Cash'}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Shipping</span>
                                                        <span className="text-green-400 font-medium">Free</span>
                                                    </div>
                                                    <div className="pt-3 border-t border-gray-800 flex justify-between items-center">
                                                        <span className="text-white font-bold">Total</span>
                                                        <span className="text-2xl font-black text-blue-500">{order.totalOrderPrice} <span className="text-xs font-bold uppercase ml-1">EGP</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-700/30 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                                            <Clock className="w-3 h-3" />
                                            Ordered on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs font-bold uppercase tracking-widest transition-all">
                                            View Invoice <ExternalLink className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
