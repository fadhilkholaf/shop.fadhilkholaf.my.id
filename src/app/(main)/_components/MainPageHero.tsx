import Link from "next/link";

import Product from "@/components/Product";
import { Product as P } from "@/prisma/generated";
import { formatDate } from "@/utils/format";

export default function MainPageHero({ product }: { product: P | null }) {
    return (
        <section className="flex flex-col gap-y-8">
            <header className="flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl xl:text-8xl">
                    I Sell Code 👩🏿‍💻
                </h1>
                {product ? (
                    <p className="text-center">
                        Latest product: {product.name} -{" "}
                        {formatDate(product.createdAt)} 📅
                    </p>
                ) : (
                    <p>Coming Soon 👷🏿!</p>
                )}
            </header>
            {product && (
                <main>
                    <Link href={`/products/${product.publicId}`}>
                        <Product product={product} />
                    </Link>
                </main>
            )}
        </section>
    );
}
