import { Metadata } from "next";

export const rootMetadata: Metadata = {
    metadataBase: new URL("/", "https://shop.fadhilkholaf.my.id"),
    title: {
        default: "Home | Fadhil Kholaf Shop",
        template: "%s | Fadhil Kholaf Shop",
    },

    description: "I sell access to my private repo here!",
    authors: [
        {
            name: "Muhammad Fadhil Kholaf",
            url: "https://fadhilkholaf.my.id",
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
        siteName: "Fadhil Kholaf Shop",
        url: "https://shop.fadhilkholaf.my.id",
        images: [
            {
                url: "https://fadhilkholaf.my.id/api/og?title=Shop.&name=My Private Repo Access",
                width: 800,
                height: 418,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        creator: "@fadhilkholaf",
        images: "https://fadhilkholaf.my.id/api/og?name=Shop.&title=My Private Repo Access",
    },
};
