"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TiLocationArrow } from "react-icons/ti";
import getAllProduct from './ProductAPI/getAllProduct.api';
import ProductsComponent from './product';
import ScrollReveal from '@/components/ScrollReveal';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageCover: string;
}

gsap.registerPlugin(ScrollTrigger);

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
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

interface BentolCardProps {
  src?: string;
  title: React.ReactNode;
  description?: string;
  category?: string;
  isComingSoon?: boolean;
}


const BentolCard = ({ src, title, description, category, isComingSoon }: BentolCardProps) => {
  const isVideo = src?.endsWith('.mp4');

  return (
    <div className="relative size-full">
      {src && (
        isVideo ? (
          <video
            src={src}
            loop
            muted
            autoPlay
            playsInline
            className="absolute left-0 top-0 size-full object-cover"
          ></video>
        ) : (
          <img
            src={src}
            alt={typeof title === 'string' ? title : "Bento Card"}
            className="absolute left-0 top-0 size-full object-cover"
          />
        )
      )}
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          {category && (
            <span className="inline-block px-3 py-1 mb-2 text-xs md:text-sm font-semibold bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              {category}
            </span>
          )}
          <h1 className="bento-title special-font text-4xl md:text-6xl font-bold">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CompletHome() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRef2 = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProduct();
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useGSAP(() => {
    // Animation for first text (right to left)
    if (sectionRef.current && wrapperRef.current) {
      const w = wrapperRef.current;
      const xEnd = -(w.scrollWidth - w.offsetWidth);

      gsap.fromTo(
        w,
        {
          x: -600,
        },
        {
          x: xEnd,
          scrollTrigger: {
            trigger: sectionRef.current,
            scrub: 0.5,
            start: "top bottom",
            end: "bottom top",
          },
          duration: 1,
          ease: "power1.out"
        }
      );
    }

    // Animation for second text (left to right) - العكس
    if (sectionRef.current && wrapperRef2.current) {
      const w2 = wrapperRef2.current;
      const xStart = -(w2.scrollWidth - w2.offsetWidth);

      gsap.fromTo(
        w2,
        {
          x: xStart, // يبدأ من الشمال
        },
        {
          x: -600, // يتحرك لليمين
          scrollTrigger: {
            trigger: sectionRef.current,
            scrub: -0.1,
            start: "top 80%",
            end: "bottom 20%",

          },
          duration: 1,
          ease: "power1.out"
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className='min-h-screen overflow-x-hidden relative z-20 bg-black pb-52'
      style={{
        background: `
          fixed linear-gradient(transparent, #070707 90%),
          fixed repeating-linear-gradient(
            #222,
            #222 1px,
            transparent 1px,
            transparent 40px
          ),
          fixed repeating-linear-gradient(
            to right,
            #222,
            #222 1px,
            transparent 1px,
            transparent 40px
          ),
          #070707
        `,
        color: '#ffffff',
      }}
    >
      {/* Scrolling Text Section - من اليمين لليسار */}
      <div className="relative z-10 text-white py-20">
        <div
          ref={wrapperRef}
          className="flex wrapper"
          style={{ width: 'max-content' }}
        >
          <div className="demo-text">
            <p
              className="text whitespace-nowrap"
              style={{
                fontSize: 'clamp(1rem, 7vw, 10rem)',
                lineHeight: 1,
                fontWeight: 900,
              }}
            >
              products that combine style, quality, and everyday performance.
            </p>
          </div>
        </div>
      </div>

      {/* Bento Grid Section */}
      <div className="container mx-auto px-3 md:px-10 relative z-10">
        <div className="px-5 py-32">
          <p className="font-circular-web text-lg text-blue-50">
            Into the Metagame Layer
          </p>
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            containerClassName="max-w-md"
            textClassName="font-circular-web text-lg text-blue-50 opacity-50"
          >
            Immerse yourself in a rich and ever-expanding universe where a
            vibrant array of products converge into an interconnected overlay
            experience on your world.
          </ScrollReveal>



        </div>

        <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
          <BentolCard
            src="/photos/pexels-themob000-28428588.jpg"
            category="Gaming"
            title={
              <>
                radia<b>n</b>t
              </>
            }
            description="A cross-platform metagame app, turning your activities across Web2 and Web3 games into a rewarding adventure."
            isComingSoon={false}
          />
        </BentoTilt>

        <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
          <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2 ">
            <BentolCard
              src="/photos/pexels-introspectivedsgn-9901534.jpg"
              category="NFT"
              title={
                <>
                  Zigma<b>m</b>a
                </>
              }
              description="An anime and gaming-inspired NFT collection - the IP primed for experians"
              isComingSoon={false}
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
            <BentolCard
              src="/Video/6650781-uhd_2160_3840_30fps.mp4"
              category="Social"
              title={
                <>
                  N<b>e</b>xus
                </>
              }
              description="A gamefied social hub, adding a new dimension of play to social ? sinteraction for Web3 communities."
              isComingSoon={false}
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0 ">
            <BentolCard
              src="/Video/8626757-hd_1920_1080_25fps.mp4"
              category="AI"
              title={
                <>
                  az<b>u</b>l
                </>
              }
              description="A cross-world AI Agent - elevating your gameplay to be more fun and productive."
              isComingSoon={false}
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt-2">
            <div className="flex flex-col size-full justify-between bg-violet-300 p-5">
              <h1 className="bento-title special-font max-w-64 text-black text-4xl md:text-6xl font-bold">
                M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
              </h1>
              <TiLocationArrow className="m-5 scale-[5] self-end" />
            </div>
          </BentoTilt>

          <BentoTilt className="bento-tilt-2">
            <img
              src="/photos/pexels-themob000-28428582.jpg"
              alt="Coming Soon"
              className="size-full object-cover object-center"
            />
          </BentoTilt>
        </div>
      </div>

      <div className="relative z-10 text-white py-30">
        <div
          ref={wrapperRef2}
          className="flex wrapper"
          style={{ width: 'max-content' }}
        >
          <div className="demo-text">
            <p
              className="text whitespace-nowrap"
              style={{
                fontSize: 'clamp(1rem, 7vw, 10rem)',
                lineHeight: 1,
                fontWeight: 900,
              }}
            >
              products that combine style, quality, and everyday performance.
            </p>
          </div>
        </div>
      </div>

      {!loading && products.length > 0 && (
        <ProductsComponent data={products} />
      )}
    </section>
  );
}