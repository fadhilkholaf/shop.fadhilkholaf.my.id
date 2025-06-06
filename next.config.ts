import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { hostname: "avatars.githubusercontent.com" },
            { hostname: "res.cloudinary.com" },
        ],
        unoptimized: true,
    },
};

export default nextConfig;
