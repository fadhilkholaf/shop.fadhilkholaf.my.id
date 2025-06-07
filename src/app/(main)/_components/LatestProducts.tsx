import Link from "next/link";

import Product from "@/components/Product";
import { Product as P } from "@/prisma/generated";

export default async function LatestProducts({ products }: { products: P[] }) {
    return (
        <section className="flex flex-col gap-y-16">
            <header>
                <h1>More Latest Products</h1>
            </header>
            <main>
                <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {products.map(function (product, i) {
                        return (
                            <li key={i}>
                                <Link
                                    href={`/products/${product.publicId}`}
                                    className="w-full"
                                >
                                    <Product product={product} />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </main>
            <footer className="flex justify-center">
                <Link href="/products">
                    <h5 className="w-fit">View All Products →</h5>
                </Link>
            </footer>
        </section>
    );
}
