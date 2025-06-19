"use client";

import ProductButton from "@/components/buttons/ProductModalButton";
import { Product } from "@/prisma/generated";

import ProductTable from "./ProductTable";

export default function ProductsAdminPageHero({
    products,
}: {
    products: Product[];
}) {
    return (
        <section className="page-section">
            <header className="flex flex-col items-center">
                <h1 className="text-center text-4xl md:text-6xl xl:text-8xl">
                    The Products 📑
                </h1>
                <p>Manage or create new products</p>
            </header>
            <main className="flex flex-col items-end gap-y-4">
                <ProductButton className="bg-secondary text-primary w-fit rounded-lg px-4 py-2">
                    Create Product
                </ProductButton>
                <article data-lenis-prevent className="h-[500px] w-full">
                    <ProductTable products={products} />
                </article>
            </main>
        </section>
    );
}
