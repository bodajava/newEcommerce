"use client";
// backdrop-blur-md
import React, { useContext, useEffect, useRef, useState } from "react";
import { User, ShoppingBag, Menu, X, Heart } from "lucide-react";
import gsap from "gsap";
import Link from "next/link";
import { useWindowScroll } from "react-use";
import { useSession, signOut } from "next-auth/react";
import { CartContext } from '../Context/CartContext';
import { useWishlist } from "../Context/WishlistContext";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLUListElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const { y: currentScrollY } = useWindowScroll();
  const { numberOfCartItem } = useContext(CartContext)
  const { wishlistCount } = useWishlist();


  const navItems = [
    { name: "Home", href: "/" },
    { name: "Love", href: "/Love", count: wishlistCount },
    { name: "Categories", href: "/Categories" },
    { name: "Product", href: "/Products" },
    { name: "Brands", href: "/Brands" },
  ];

  useEffect(() => {
    if (!menuRef.current || !navLinksRef.current || !overlayRef.current) return;

    if (isMenuOpen) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';

      gsap.set(menuRef.current, { display: "block" });
      gsap.set(overlayRef.current, { display: "block" });
      gsap.set(navLinksRef.current.children, { x: -50, opacity: 0, visibility: "visible" });

      const tl = gsap.timeline();
      tl.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" })
        .to(menuRef.current, { x: 0, duration: 0.4, ease: "power3.out" }, "-=0.2")
        .to(navLinksRef.current.children, { x: 0, opacity: 1, stagger: 0.1, duration: 0.3, ease: "power2.out" }, "-=0.2");
    } else {
      // Restore body scroll when menu is closed
      document.body.style.overflow = '';

      const tl = gsap.timeline({
        onComplete: () => {
          if (menuRef.current) gsap.set(menuRef.current, { display: "none" });
          if (overlayRef.current) gsap.set(overlayRef.current, { display: "none" });
          if (navLinksRef.current) gsap.set(navLinksRef.current.children, { x: -50, opacity: 0, visibility: "visible" });
        },
      });
      tl.to(navLinksRef.current.children, { x: -50, opacity: 0, stagger: 0.05, duration: 0.2, ease: "power2.in" })
        .to(menuRef.current, { x: "100%", duration: 0.3, ease: "power3.in" }, "-=0.1")
        .to(overlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.2");
    }

    // Cleanup function
    return () => {
      if (!isMenuOpen) {
        document.body.style.overflow = '';
      }
    };
  }, [isMenuOpen]);

  // Scroll animation logic - same as reference code
  useEffect(() => {
    if (!navContainerRef.current) return;

    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  // GSAP animation for navbar visibility
  useEffect(() => {
    if (!navContainerRef.current) return;

    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div
        ref={navContainerRef}
        className="fixed inset-x-0 top-4 z-[50] h-16 border-none transition-all duration-700 sm:inset-x-6"
      >
        <header ref={headerRef} className="absolute top-1/2 w-full -translate-y-1/2 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="text-xl sm:text-2xl tracking-[0.4em] flex items-center hover:text-sky-400 transition-colors">
                E-co<span className="text-sky-500 mx-[2px]">m</span>mers
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:block">
                <ul className="flex gap-6 xl:gap-8 text-xs xl:text-sm">
                  {navItems.map((item, index) => (
                    <li key={index}>
                      <Link href={item.href} prefetch={true} className="hover:text-sky-400 transition-colors relative group">
                        {item.name}
                        {item.count !== undefined && item.count > 0 && (
                          <span className="absolute -top-2 -right-4 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white animate-pulse">
                            {item.count}
                          </span>
                        )}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-sky-400 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Right side - Desktop */}
              <div className="hidden md:flex items-center gap-4 lg:gap-5 text-sky-400" suppressHydrationWarning>
                {session && (
                  <>
                    <Link href="/Cart" prefetch={true} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors relative">
                      <ShoppingBag size={20} />
                      {numberOfCartItem > 0 && <div className="absolute -top-2 -right-4 w-5 h-5 bg-white rounded-full flex items-center justify-center text-black text-xs">{numberOfCartItem}</div>
                      }
                      <span className="text-white text-sm hidden lg:inline"> cart</span>
                    </Link>
                    <span className="text-white">|</span>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="text-white text-sm hover:text-sky-400 transition-colors"
                    >
                      Sign out
                    </button>
                  </>
                )}
                {!session && (
                  <>
                    <Link href="/Cart" prefetch={true} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors relative">
                      <ShoppingBag size={20} />
                      {numberOfCartItem > 0 && (
                        <div className="absolute -top-2 -right-4 w-5 h-5 bg-white rounded-full flex items-center justify-center text-black text-xs">{numberOfCartItem}</div>
                      )}
                      <span className="text-white text-sm hidden lg:inline"> cart</span>
                    </Link>
                    <span className="text-white">|</span>
                    <Link href="/Login" prefetch={true} className="text-white text-sm hover:text-sky-400 transition-colors">Login</Link>
                    <span className="text-white">|</span>
                    <Link href="/register" prefetch={true} className="text-white text-sm hover:text-sky-400 transition-colors">Register</Link>
                  </>
                )}
              </div>

              {/* Mobile Right Side (Cart + Menu Toggle) */}
              <div className="flex items-center gap-2 md:hidden">
                <Link href="/Cart" prefetch={true} className="flex items-center gap-1 cursor-pointer text-sky-400 hover:text-white transition-colors relative p-2" onClick={() => setIsMenuOpen(false)}>
                  <ShoppingBag size={20} />
                  {numberOfCartItem > 0 && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center text-black text-[10px]">{numberOfCartItem}</div>
                  )}
                </Link>

                <button onClick={toggleMenu} className="text-white hover:text-sky-400 transition-colors p-2" aria-label="Toggle menu">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
        style={{ display: "none", opacity: 0 }}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-black z-[70] lg:hidden shadow-2xl overflow-y-auto"
        style={{ display: "none", transform: "translateX(100%)" }}
        aria-hidden={!isMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full p-6 pt-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
            <span className="text-xl font-semibold text-sky-400">Menu</span>
            <button onClick={toggleMenu} className="text-white hover:text-sky-400 transition-colors" aria-label="Close menu">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1">
            <ul ref={navLinksRef} className="space-y-6">
              {navItems.map((item, index) => (
                <li key={index} className="relative">
                  <Link href={item.href} prefetch={true} onClick={() => setIsMenuOpen(false)} className="text-lg text-white hover:text-sky-400 transition-colors block py-2 border-b border-gray-800 hover:border-sky-400 relative z-10" style={{ visibility: "visible" }}>
                    {item.name}
                    {item.count !== undefined && item.count > 0 && (
                      <span className="absolute top-2 right-4 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                        {item.count}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800" suppressHydrationWarning>
            <div className="flex flex-col gap-4 text-sky-400">
              {session && (
                <Link href="/Cart" prefetch={true} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors relative" onClick={() => setIsMenuOpen(false)}>
                  <ShoppingBag size={20} />
                  {numberOfCartItem > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center text-black text-xs">{numberOfCartItem}</div>
                  )}
                  <span className="text-white text-sm"> cart</span>
                </Link>
              )}
              {session ? (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="text-white text-sm hover:text-sky-400 transition-colors text-left"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <Link href="/Cart" prefetch={true} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors relative" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingBag size={20} />
                    {numberOfCartItem > 0 && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center text-black text-xs">{numberOfCartItem}</div>
                    )}
                    <span className="text-white text-sm"> cart</span>
                  </Link>
                  <Link href="/Login" prefetch={true} className="text-white text-sm hover:text-sky-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link href="/register" prefetch={true} className="text-white text-sm hover:text-sky-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
