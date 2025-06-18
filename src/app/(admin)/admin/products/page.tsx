import { getAllProduct } from "@/database/product";

import ProductsAdminPageHero from "./_components/AdminProductsPageHero";

export default async function AdminProductsPage() {
    const products = await getAllProduct();

    return (
        <main className="layout mt-16 flex flex-col gap-y-16 md:gap-y-32">
            <ProductsAdminPageHero products={products} />
        </main>
    );
}
