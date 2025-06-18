import { getAllProduct, getAllProductLength } from "@/database/product";

import ProductsPageHero from "./_components/ProductsPageHero";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { page } = await searchParams;
    const formatedPage =
        !isNaN(Number(page)) && Number(page) ? Number(page) : 1;
    const perPage = 6;

    const products = await getAllProduct(
        undefined,
        !isNaN(Number(page)) && Number(page) !== 0
            ? (Number(page) - 1) * perPage
            : 0,
        perPage,
        {
            createdAt: "desc",
        },
    );

    const productsLength = await getAllProductLength();

    return (
        <main className="layout mt-16 flex flex-col gap-y-16 md:gap-y-32">
            <ProductsPageHero
                products={products}
                counts={productsLength}
                page={formatedPage}
                perPage={perPage}
            />
        </main>
    );
}
