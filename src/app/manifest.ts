// WHY THE FILE NAME IS MANIFEST 😭🫶✌️ I'M GONNA MANIFEST WORKING IN FAANG COMPANY, STUDYING IN JAPAN, HAVE A GOOD LIFE IN JAPAN, AND ALL THE OTHER GOOD THINGS.

import { MetadataRoute } from "next";

import { getBaseUrl } from "@/utils/url";

export default function manifest(): MetadataRoute.Manifest {
    const baseUrl = getBaseUrl();

    return {
        name: "Shop",
        short_name: "Shop",
        start_url: "/",
        lang: "en-US",
        icons: [
            {
                src: `${baseUrl}/images/icons/manifest-192.png`,
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: `${baseUrl}/images/icons/manifest-512.png`,
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
        theme_color: "#fccee8",
        background_color: "#fccee8",
        display: "standalone",
    };
}
