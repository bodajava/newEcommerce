import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./-Components/Navbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { ToasterProvider } from "@/components/ToasterProvider";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import GradualBlur from "@/components/GradualBlur";
import ClickSpark from "@/components/ClickSpark";
import CartProvider from "./Context/CartContext";
import WishlistProvider from "./Context/WishlistContext";


gsap.registerPlugin(ScrollTrigger)

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-commers | Premium Shopping Experience",
  description: "Discover a world of endless possibilities with E-commers. Shop the latest trends, find amazing deals, and experience shopping like never before.",
  keywords: ["e-commerce", "shopping", "trends", "deals", "premium", "Next.js", "React"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} font-montserrat antialiased`}
        suppressHydrationWarning
      >
        <SessionProviderWrapper>
          <CartProvider>
            <WishlistProvider>
              <ClickSpark
                sparkColor='#fff'
                sparkSize={10}
                sparkRadius={15}
                sparkCount={8}
                duration={400}
              >
                {children}
                <Navbar />
                <ToasterProvider />
                <GradualBlur
                  preset="page-footer"
                  target="page"
                  strength={3}
                  height="2em"
                />
              </ClickSpark>
            </WishlistProvider>
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
