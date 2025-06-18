import Link from "next/link";

import Product from "@/components/Product";
import { Product as P } from "@/prisma/generated";

export default function ProductsPageHero({
    products,
    counts,
    page,
    perPage,
}: {
    products: P[];
    counts: number;
    page: number;
    perPage: number;
}) {
    const totalPage = Math.ceil(counts / perPage);
    const prevPage = page > 1 ? (page <= totalPage ? page - 1 : totalPage) : 1;
    const nextPage = page >= 1 ? (page < totalPage ? page + 1 : totalPage) : 1;

    return (
        <section className="page-section">
            <header className="flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl xl:text-8xl">
                    Products 📃
                </h1>
                <p>Take it if you want it! 👇🏿</p>
            </header>
            <main>
                <ul className="grid grid-cols-1 gap-x-8 gap-y-8 md:gap-y-16 lg:grid-cols-2">
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
                {page > 1 && (
                    <Link href={`/products?page=${prevPage}`}>
                        <h4>← Prev</h4>
                    </Link>
                )}
                <h4>{page}</h4>
                {page < totalPage && (
                    <Link href={`/products?page=${nextPage}`}>
                        <h4>Next →</h4>
                    </Link>
                )}
            </footer>
        </section>
    );
}
