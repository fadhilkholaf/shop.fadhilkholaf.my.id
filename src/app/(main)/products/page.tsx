import Image from "next/image";
import Link from "next/link";

import { getAllProduct } from "@/query/product";

export default async function ProductsPage() {
    const products = await getAllProduct();

    return (
        <main className="layout mt-32">
            <h1>Products Page</h1>
            <ul className="grid grid-cols-1 gap-x-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map(function (product, i) {
                    return (
                        <li key={i} className="w-full">
                            <Link
                                href={`/products/${product.publicId}`}
                                className="inline-block overflow-hidden rounded-lg"
                            >
                                <header>
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={1024}
                                        height={1024}
                                        priority
                                        className="aspect-video h-fit w-full object-cover"
                                    />
                                </header>
                                <main className="p-4">
                                    <h2>{product.name}</h2>
                                </main>
                                <footer className="p-4">
                                    <button type="button">Details →</button>
                                </footer>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </main>
    );
}
