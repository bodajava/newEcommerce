"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toaster';
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import forgotPasswordAction from '../ActionAuth/forgotPassword';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const emailSchema = z.object({
    email: z.email().nonempty("this email faild can't be empty"),
});

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "" }
    });

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
            );
        }
    }, []);

    const onSubmit = async (values: z.infer<typeof emailSchema>) => {
        setIsLoading(true);
        try {
            const res = await forgotPasswordAction(values.email);
            // API returns statusMsg: "success" or similar
            if (res.statusMsg === "success" || res.status === "success" || res.message === "success") {
                toast({ title: "Success", description: "Reset code sent to your email", variant: "success" });
                sessionStorage.setItem("resetEmail", values.email);
                router.push('/forgetpassword/verify');
            } else {
                toast({
                    title: "Server Error",
                    description: res.message || "Failed to send email. Ensure the email is registered.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to connect to server", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1e1e,transparent)] opacity-20 pointer-events-none" />

            <div ref={containerRef} className="w-full max-w-md relative z-10">
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 mb-4 border border-blue-500/20">
                            <Mail size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-white">Forgot Password?</h1>
                        <p className="text-gray-400 mt-2">Enter your email and we'll send you a 6-digit code.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Email Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <button type="submit" disabled={isLoading} className="btn w-full py-4 text-lg font-bold">
                                {isLoading ? "Sending..." : "Reset Code"}
                            </button>
                            <Link href="/Login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                                <ArrowLeft size={16} /> Back to Sign In
                            </Link>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
