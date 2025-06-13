import Link from "next/link";

import Product from "@/components/Product";
import { Product as P } from "@/prisma/generated";

export default async function LatestProducts({ products }: { products: P[] }) {
    return (
        <section className="flex flex-col gap-y-8 md:gap-y-16">
            <header className="flex flex-col items-center">
                <h1 className="text-5xl md:text-7xl xl:text-9xl">
                    More Products 📑
                </h1>
                <p>The repositories</p>
            </header>
            <main>
                <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                    <h4 className="w-fit">View All Products →</h4>
                </Link>
            </footer>
        </section>
    );
}
