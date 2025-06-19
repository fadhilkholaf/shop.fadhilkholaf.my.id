import { MetadataRoute } from "next";

const sitemap = (): MetadataRoute.Sitemap => {
    return [
        {
            url: "https://www.shop.fadhilkholaf.my.id",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: "https://www.shop.fadhilkholaf.my.id/products",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.75,
        },
    ];
};

export default sitemap;
