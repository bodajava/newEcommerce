"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CompletHome from "./-Components/CompletHome";
import { useSession } from 'next-auth/react';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { data: session } = useSession();
  const welcomeRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const desc1Ref = useRef<HTMLParagraphElement>(null);
  const desc2Ref = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const userName = session?.user?.name || session?.user?.email || 'Guest';


  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for sequential animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Video fade in
      if (videoRef.current) {
        gsap.set(videoRef.current, { opacity: 0, scale: 1.1 });
        gsap.to(videoRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
        });
      }

      // Overlay fade in
      if (overlayRef.current) {
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        });
      }

      // Welcome text animation
      if (welcomeRef.current) {
        gsap.set(welcomeRef.current, { opacity: 0, y: 50 });
        tl.to(
          welcomeRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5"
        );
      }


      const heroTl = gsap.timeline({
        scrollTrigger : {
          trigger : 'hero-container'
        }
      })

      // Title animation with letter spacing effect
      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 0, y: 50, scale: 0.9 });
        tl.to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "back.out(1.9)",
          },
          "-=0.7"
        );
      }

      // Description animations
      if (desc1Ref.current) {
        gsap.set(desc1Ref.current, { opacity: 0, x: -30 });
        tl.to(
          desc1Ref.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }

      if (desc2Ref.current) {
        gsap.set(desc2Ref.current, { opacity: 0, x: -30 });
        tl.to(
          desc2Ref.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6"
        );
      }

      // Buttons animation
      if (buttonsRef.current) {
        const buttons = buttonsRef.current.children;
        gsap.set(buttons, { opacity: 0, y: 30, scale: 0.8 });
        tl.to(
          buttons,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.4)",
          },
          "-=0.4"
        );
      }

      // Features animation
      if (featuresRef.current) {
        const featureItems = featuresRef.current.children;
        gsap.set(featureItems, { opacity: 0, y: 40 });
        tl.to(
          featureItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    });

    return () => ctx.revert();
  }, []);


  useGSAP(() => {
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-container',
        start: '1% top',
        end: 'bottom top',
        scrub: true,
      }    });
      heroTl.to('.hero-container' , {
        rotate : 7,
        scale :0.9,
        yPercent : 30 ,
        ease : 'power1.inOut'
      })

  });

  return <>
<section className="z-50">
<div className="hero-container relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/Video/5912605-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div ref={overlayRef} className="absolute inset-0 bg-black/60 z-0"></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-10 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            {/* Welcome Text */}
            <div className="space-y-4">
              <h2 
                ref={welcomeRef}
                className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight"
              >
                Welcome {userName} to
              </h2>
              <p 
                ref={titleRef}
                className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.2em] sm:tracking-[0.3em] font-bold flex items-center flex-wrap gap-2"
              >
                E-co<span className="text-sky-500 mx-1">m</span>mers
              </p>
            </div>
            
            {/* Description */}
            <div className="space-y-4 max-w-2xl">
              <p 
                ref={desc1Ref}
                className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed"
              >
                Discover a world of endless possibilities. Shop the latest trends, 
                find amazing deals, and experience shopping like never before.
              </p>
              <p 
                ref={desc2Ref}
                className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed"
              >
                Your one-stop destination for quality products and exceptional service.
              </p>
            </div>
            

          </div>
        </div>
      </div>
      <div className="absolute downe-rigth  tracking-[0.2em] text-white sm:tracking-[0.3em] bottom-0 right-0 p-14 text-5xl sm:text-2xl md:text-4xl">
          <p>SHOP NOW </p>
        </div>
    </div>
    <CompletHome />
</section>
    
  </>;
}
