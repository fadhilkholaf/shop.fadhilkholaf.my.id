import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { SessionProvider } from "next-auth/react";

import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import CartModalProviderWrapper from "@/components/wrapper/CartModalProviderWrapper";
import LenisWrapper from "@/components/wrapper/LenisWrapper";
import PaypalWrapper from "@/components/wrapper/PaypalWrapper";
import SignInModalProvider from "@/context/SignInModalContext";
import { rootMetadata } from "@/data/metadata";

import "./globals.css";

export const metadata: Metadata = rootMetadata;

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist",
});
const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="bg-primary text-secondary">
            <head>
                <Script
                    crossOrigin="anonymous"
                    src="//unpkg.com/react-scan/dist/auto.global.js"
                />
            </head>
            <body
                className={`${geist.className} ${geistMono.variable} antialiased`}
            >
                <SessionProvider>
                    <PaypalWrapper>
                        <LenisWrapper>
                            <SignInModalProvider>
                                <CartModalProviderWrapper>
                                    <Navbar />
                                    {children}
                                    <Footer />
                                </CartModalProviderWrapper>
                            </SignInModalProvider>
                        </LenisWrapper>
                    </PaypalWrapper>
                </SessionProvider>
            </body>
        </html>
    );
}
