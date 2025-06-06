import Link from "next/link";

import Product from "@/components/Product";
import { getAllProduct, getAllProductLength } from "@/query/product";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { page } = await searchParams;
    const formatedPage =
        !isNaN(Number(page)) && Number(page) ? Number(page) : 1;
    const perPage = 9;

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

    const totalPage = Math.ceil(productsLength / perPage);
    const prevPage =
        formatedPage > 1
            ? formatedPage <= totalPage
                ? formatedPage - 1
                : totalPage
            : 1;
    const nextPage =
        formatedPage >= 1
            ? formatedPage < totalPage
                ? formatedPage + 1
                : totalPage
            : 1;

    return (
        <main className="layout mt-32 flex flex-col gap-y-16">
            <header>
                <h1>Products Page</h1>
            </header>
            <main>
                <ul className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
                    {products.map(function (product, i) {
                        return (
                            <li key={i}>
                                <Link
                                    href={`/products/${product.publicId}`}
                                    className="w-full rounded-lg"
                                >
                                    <Product product={product} />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </main>
            <footer className="flex justify-center gap-x-4">
                {formatedPage > 1 && (
                    <Link href={`/products?page=${prevPage}`} scroll={false}>
                        <h5>← Prev</h5>
                    </Link>
                )}
                <h5>{formatedPage}</h5>
                {formatedPage < totalPage && (
                    <Link href={`/products?page=${nextPage}`} scroll={false}>
                        <h5>Next →</h5>
                    </Link>
                )}
            </footer>
        </main>
    );
}
