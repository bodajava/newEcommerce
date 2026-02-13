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
import resetPasswordAction from '../../ActionAuth/resetPassword';
import { Lock, CheckCircle2 } from 'lucide-react';

const resetSchema = z.object({
    newPassword: z.string()
        .nonempty("this password faild can't be empty")
        .min(6, "minmum length 6 hcars"),
    confirmPassword: z.string()
        .nonempty("tthe rePassword don't match password "),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "password && repassword not match",
    path: ["confirmPassword"],
});

export default function ResetPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof resetSchema>>({
        resolver: zodResolver(resetSchema),
        defaultValues: { newPassword: "", confirmPassword: "" }
    });

    useEffect(() => {
        if (!sessionStorage.getItem("resetEmail")) {
            router.push('/forgetpassword');
            return;
        }

        if (containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        }
    }, [router]);

    const onSubmit = async (values: z.infer<typeof resetSchema>) => {
        const email = sessionStorage.getItem("resetEmail");
        if (!email) {
            toast({ title: "Error", description: "Session expired. Please restart.", variant: "destructive" });
            router.push('/forgetpassword');
            return;
        }

        setIsLoading(true);
        try {
            const res = await resetPasswordAction({
                email,
                newPassword: values.newPassword
            });

            if (res.token) {
                toast({ title: "Success", description: "Password reset successful", variant: "success" });
                setIsSuccess(true);
                sessionStorage.removeItem("resetEmail");
                setTimeout(() => router.push('/Login'), 3000);
            } else {
                toast({ title: "Error", description: res.message || "Failed to reset password", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-12 text-center shadow-2xl max-w-sm w-full">
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">Password Reset!</h1>
                    <p className="text-gray-400 mb-8">Your account is now secure. You'll be redirected to login shortly.</p>
                    <button onClick={() => router.push('/Login')} className="btn w-full">Sign In Now</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1e1e,transparent)] opacity-20 pointer-events-none" />

            <div ref={containerRef} className="w-full max-w-md relative z-10">
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 mb-4 border border-blue-500/20">
                            <Lock size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-white">New Password</h1>
                        <p className="text-gray-400 mt-2">Set a strong password to protect your account.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <button type="submit" disabled={isLoading} className="btn w-full py-4 text-lg font-bold">
                                {isLoading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
