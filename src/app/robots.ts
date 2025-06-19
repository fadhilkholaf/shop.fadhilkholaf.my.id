import { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
            },
        ],
        sitemap: "https://www.shop.fadhilkholaf.my.id/sitemap.xml",
    };
};

export default robots;
