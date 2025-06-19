import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { SessionProvider } from "next-auth/react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CartModalProviderWrapper from "@/components/wrapper/CartModalProviderWrapper";
import LenisWrapper from "@/components/wrapper/LenisWrapper";
import PaypalWrapper from "@/components/wrapper/PaypalWrapper";
import SignInModalProvider from "@/components/context/SignInModalContext";
import { getOgUrl } from "@/utils/url";

import "@/styles/globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("/", "https://www.shop.fadhilkholaf.my.id"),
    title: {
        default: "Home | Shop",
        template: "%s | Shop",
    },
    description:
        "I sell my GitHub private repo access. There is some repo like website templates, my side projects, and school projects.",
    authors: [
        {
            name: "Muhammad Fadhil Kholaf",
            url: "https://www.fadhilkholaf.my.id",
        },
    ],
    generator: "Next.js",
    keywords:
        "Fadhil Kholaf Shop, Fadhil, Kholaf, Shop, Fadhil Kholaf Private GitHub Repository Access, Private, GitHub, Repository, Access",
    referrer: "origin",
    creator: "Muhammad Fadhil Kholaf",
    publisher: "Vercel",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: { canonical: "./" },
    openGraph: {
        siteName: "Shop",
        url: "https://www.shop.fadhilkholaf.my.id",
        images: [
            {
                url: getOgUrl("Shop", "I Sell Code"),
                width: 800,
                height: 418,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        creator: "@fadhilkholaf",
        images: getOgUrl("Shop", "I Sell Code"),
    },
};

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
                <meta name="apple-mobile-web-app-title" content="Shop" />
            </head>
            <body
                className={`${geist.className} ${geistMono.variable} antialiased`}
            >
                <SessionProvider>
                    <PaypalWrapper>
                        <SignInModalProvider>
                            <CartModalProviderWrapper>
                                <LenisWrapper>
                                    <Navbar />
                                    {children}
                                    <Footer />
                                </LenisWrapper>
                            </CartModalProviderWrapper>
                        </SignInModalProvider>
                    </PaypalWrapper>
                </SessionProvider>
            </body>
        </html>
    );
}
