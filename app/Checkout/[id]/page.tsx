"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { checkoutSchema, checkoutSchemaType } from '../../schema/checkoutSchema';
import { createCashOrder } from '../../ActionOrders/createCashOrder';
import { createCheckoutSession } from '../../ActionOrders/createCheckoutSession';
import getLogedUser from '../../ActionCart/getLogedUserCaer';
import { useToast } from '@/components/ui/toaster';
import { useParams, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { MapPin, Phone, CreditCard, ShoppingBag, ArrowRight, CheckCircle2, Banknote } from 'lucide-react';

export default function Checkout() {
    const params = useParams();
    const id = params?.id as string;
    const { toast } = useToast();
    const router = useRouter();
    const [cartData, setCartData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmittingCash, setIsSubmittingCash] = useState(false);
    const [isSubmittingCard, setIsSubmittingCard] = useState(false);
    const [isOrdered, setIsOrdered] = useState(false);

    const form = useForm<checkoutSchemaType>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            details: "",
            phone: "",
            city: "",
        },
    });

    useEffect(() => {
        async function fetchCart() {
            try {
                const res = await getLogedUser();
                if (res.status === "success") {
                    setCartData(res.data);
                } else {
                    toast({ title: "Error", description: "Failed to load cart details", variant: "destructive" });
                    router.push('/Cart');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCart();
    }, [router, toast]);

    const handleCashOrder = async (values: checkoutSchemaType) => {
        if (!cartData?._id) return;
        setIsSubmittingCash(true);
        try {
            const res = await createCashOrder(cartData._id, values);
            if (res.status === "success") {
                setIsOrdered(true);
                toast({ title: "Success!", description: "Order created successfully!", variant: "success" });
                gsap.to(".checkout-container", {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    ease: "power2.inOut"
                });
                setTimeout(() => router.push('/'), 3000);
            } else {
                toast({ title: "Order Failed", description: res.message || "Could not complete the order.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setIsSubmittingCash(false);
        }
    };

    const handleCardPayment = async (values: checkoutSchemaType) => {
        if (!id) return;
        setIsSubmittingCard(true);
        try {
            const res = await createCheckoutSession(id, window.location.origin, values);
            if (res.status === 'success') {
                window.location.href = res.session.url;
            } else {
                toast({ title: "Error", description: res.message || "Payment failed", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Unexpected error occurred.", variant: "destructive" });
        } finally {
            setIsSubmittingCard(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isOrdered) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
                <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-blue-500/30 text-center max-w-md w-full shadow-2xl">
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Order Placed!</h2>
                    <p className="text-gray-400 mb-8">
                        Your order has been received and is being processed. Thank you for shopping with us!
                    </p>
                    <div className="text-sm text-blue-400/60 animate-pulse">
                        Redirecting to home in 3 seconds...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto checkout-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Shipping Form */}
                    <div className="bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 shadow-2xl h-fit">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <MapPin className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Shipping Details</h1>
                                <p className="text-gray-400 text-sm">Where should we send your order?</p>
                            </div>
                        </div>

                        <Form {...form}>
                            <form className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-300">City</FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <Input
                                                        placeholder="e.g. Cairo"
                                                        className="bg-gray-900/50 border-gray-700 h-12 pl-4 focus:ring-blue-500/20 transition-all text-white"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-400 text-xs mt-1" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-300">Phone Number</FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <Input
                                                        placeholder="e.g. 01012345678"
                                                        className="bg-gray-900/50 border-gray-700 h-12 pl-4 focus:ring-blue-500/20 transition-all text-white"
                                                        {...field}
                                                    />
                                                    <Phone className="absolute right-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-400 text-xs mt-1" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="details"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-300">Address Details</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 123 Street, District, Apartment"
                                                    className="bg-gray-900/50 border-gray-700 h-12 pl-4 focus:ring-blue-500/20 transition-all text-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400 text-xs mt-1" />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={form.handleSubmit(handleCashOrder)}
                                        disabled={isSubmittingCash || isSubmittingCard}
                                        className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmittingCash ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <Banknote className="w-5 h-5" />
                                        )}
                                        Cash Order
                                    </button>

                                    <button
                                        type="button"
                                        onClick={form.handleSubmit(handleCardPayment)}
                                        disabled={isSubmittingCash || isSubmittingCard}
                                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmittingCard ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <CreditCard className="w-5 h-5" />
                                        )}
                                        Pay with Card
                                    </button>
                                </div>
                            </form>
                        </Form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:pl-8">
                        <div className="bg-gray-900/40 rounded-3xl border border-gray-800 p-8">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-blue-400" />
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartData?.products?.map((item: any) => (
                                    <div key={item._id} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                                            <img src={item.product.imageCover} alt={item.product.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white text-sm font-medium truncate">{item.product.title}</h4>
                                            <p className="text-gray-500 text-xs">Qty: {item.count} × {item.price / item.count} EGP</p>
                                        </div>
                                        <div className="text-white text-sm font-semibold">
                                            {item.price} EGP
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-gray-800 pt-6">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Subtotal</span>
                                    <span>{cartData?.totalCartPrice} EGP</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-400 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-white text-xl font-bold pt-2">
                                    <span>Total</span>
                                    <span className="text-blue-400">{cartData?.totalCartPrice} EGP</span>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-start gap-3">
                                <CreditCard className="w-5 h-5 text-blue-400 mt-1" />
                                <div>
                                    <h4 className="text-white text-sm font-semibold">Payment Method</h4>
                                    <p className="text-gray-400 text-xs mt-0.5">Cash on Delivery (COD)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
