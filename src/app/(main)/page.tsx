import { getAllProduct } from "@/query/product";

import FAQ from "./_components/FAQ";
import Features from "./_components/Features";
import LatestProducts from "./_components/LatestProducts";
import MainPageHero from "./_components/MainPageHero";
import Testimonials from "./_components/Testimonials";

export default async function MainPage() {
    const products = await getAllProduct(undefined, undefined, 3, {
        createdAt: "desc",
    });

    return (
        <main className="layout mt-32 flex flex-col gap-y-32">
            <MainPageHero product={products[0]} />
            <LatestProducts products={products} />
            <Features />
            <Testimonials />
            <FAQ />
        </main>
    );
}
