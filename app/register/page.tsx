"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { regesterSchema, regesterSchemaType } from '../schema/RegesterSchema';
import axios from 'axios'
import { useToast } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function Register() {
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

  const form = useForm<regesterSchemaType>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
    resolver: zodResolver(regesterSchema)
  });

  async function onSubmit(values: regesterSchemaType) {
    try {
      const res = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signup`, values);

      if (res.data.message === "success") {
        toast({
          title: "Success!",
          description: "Account created successfully. Redirecting to login...",
          variant: "success",
        });

        // Start smooth transition animation
        setIsTransitioning(true);

        // Wait a bit for toast to show
        setTimeout(() => {
          if (overlayRef.current && containerRef.current) {
            // Simple fade out the form
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 0.4,
              ease: "power1.out"
            });

            // Simple fade in overlay
            gsap.to(overlayRef.current, {
              opacity: 1,
              duration: 0.4,
              ease: "power1.out",
              onComplete: () => {
                // Navigate after a short delay
                setTimeout(() => {
                  router.push('/Login');
                }, 800);
              }
            });
          } else {
            // Fallback if refs not ready
            setTimeout(() => {
              router.push('/Login');
            }, 1200);
          }
        }, 500);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    }
  }


  return (
    <>
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
              Create Account
            </h2>
            <p className="text-center text-gray-400 mb-8">
              Sign up to get started
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField

                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Name</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder="Enter your name"
                          {...field}
                        />
                      </FormControl>
                      {form.formState.touchedFields.name && (
                        <FormMessage className="font-semibold text-blue-50 rounded-2xl py-2 text-center px-1 bg-red-600" />
                      )}                    </FormItem>
                  )}
                />

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
                      )}
                    </FormItem>
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

                <FormField
                  control={form.control}
                  name="rePassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">rePassword</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder="Enter the rePassword"
                          {...field}
                        />
                      </FormControl>
                      {form.formState.touchedFields.rePassword && (
                        <FormMessage className="font-semibold text-blue-50 rounded-2xl py-2 text-center px-1 bg-red-600" />
                      )}                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">phone</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder="Enter the phone"
                          {...field}
                        />
                      </FormControl>
                      {form.formState.touchedFields.rePassword && (
                        <FormMessage className="font-semibold text-blue-50 rounded-2xl py-2 text-center px-1 bg-red-600" />
                      )}
                    </FormItem>
                  )}
                />


                <button
                  type="submit"
                  className='btn w-full'
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Registering...' : 'Register now'}
                </button>


              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/Login" className="text-blue-400 hover:text-blue-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
