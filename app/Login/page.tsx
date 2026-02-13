"use client";

import { useRef, useState, useEffect } from 'react'
import { Form, FormItem, FormMessage, FormControl, FormLabel, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import gsap from 'gsap';
import { signinSchema, signinSchemaType } from '../schema/signin';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import Link from 'next/link';

export default function Login() {
  const { toast } = useToast();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when transitioning
  useEffect(() => {
    if (isTransitioning) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTransitioning]);



  const form = useForm<signinSchemaType>({
    mode: 'onTouched',
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signinSchema)
  });




  async function onSubmit(values: signinSchemaType) {

    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: '/'
    })

    if (res?.ok) {
      toast({
        title: "success",
        description: "success login",
        variant: "success",
      });

      setIsTransitioning(true);

      setTimeout(() => {
        if (overlayRef.current && containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: "power1.out"
          });

          gsap.to(overlayRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: "power1.out",
            onComplete: () => {
              setTimeout(() => {
                router.push('/');
              }, 800);
            }
          });
        } else {
          setTimeout(() => {
            router.push('/');
          }, 1200);
        }
      }, 500);

    } else {
      toast({
        title: "success",
        description: res?.error || "error pleass try agean",
        variant: "destructive",
      });
    }

    // try {
    //   const res = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, values);

    //   if(res.data.message === "success"){
    //     toast({
    //       title: "Success!",
    //       description: "Login successful. Redirecting...",
    //       variant: "success",
    //     });

    //     // Start smooth transition animation
    //     setIsTransitioning(true);

    //     // Wait a bit for toast to show
    //     setTimeout(() => {
    //       if (overlayRef.current && containerRef.current) {
    //         // Simple fade out the form
    //         gsap.to(containerRef.current, {
    //           opacity: 0,
    //           duration: 0.4,
    //           ease: "power1.out"
    //         });

    //         // Simple fade in overlay
    //         gsap.to(overlayRef.current, {
    //           opacity: 1,
    //           duration: 0.4,
    //           ease: "power1.out",
    //           onComplete: () => {
    //             // Navigate to home page after a short delay
    //             setTimeout(() => {
    //               router.push('/');
    //             }, 800);
    //           }
    //         });
    //       } else {
    //         // Fallback if refs not ready
    //         setTimeout(() => {
    //           router.push('/');
    //         }, 1200);
    //       }
    //     }, 500);
    //   }
    // } catch(err: any) {
    //   console.log(err);
    //   toast({
    //     title: "Error",
    //     description: err.response?.data?.message || "Login failed. Please try again.",
    //     variant: "destructive",
    //   });
    // }
  }

  return <>
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm ${isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      style={{
        transition: 'opacity 0.5s ease-in-out'
      }}
      aria-hidden={!isTransitioning}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-white">
          <div className="mb-3">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-sm opacity-80">Redirecting...</p>
        </div>
      </div>
    </div>

    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div ref={containerRef} className="w-full max-w-md pt-10">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-400 mb-8">
            Sign in to your account
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.touchedFields.email && (
                      <FormMessage className="font-semibold text-blue-50 rounded-2xl py-2 text-center px-1 bg-red-600" />
                    )}                    </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.touchedFields.password && (
                      <FormMessage className="font-semibold text-blue-50 rounded-2xl py-2 text-center px-1 bg-red-600" />
                    )}                    </FormItem>
                )}
              />

              <button
                type="submit"
                className='btn w-full'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Logging in...' : 'Sign in'}
              </button>


            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
              Register
            </Link>

            <Link href="/forgetpassword" className="ms-3 text-blue-400 hover:text-blue-300 transition-colors">
              forget password
            </Link>
          </p>
        </div>
      </div>
    </div>
  </>
}
