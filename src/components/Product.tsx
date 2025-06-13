import Image from "next/image";

import { Product as P } from "@/prisma/generated";
import { formatUsd } from "@/utils/format";

export default function Product({ product }: { product: P }) {
    return (
        <article className="flex h-full flex-col gap-y-2 md:gap-y-4">
            <header className="bg-secondary md;rounded-3xl flex flex-col gap-y-2 rounded-2xl p-2 md:p-4">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={1024}
                    height={1024}
                    priority
                    className="aspect-video w-full rounded-lg object-cover"
                />
            </header>
            <main className="flex h-full flex-col justify-between gap-y-2 px-2 md:px-4">
                <div>
                    <p className="uppercase">
                        {product.category.replaceAll(";", " • ")}
                    </p>
                    <h1>{product.name}</h1>
                </div>
                <p className="font-mono">{formatUsd(product.price)} USD</p>
            </main>
            <footer className="px-2 md:px-4">
                <h4 className="flex w-full justify-between">
                    <span>Details</span>
                    <span>→</span>
                </h4>
            </footer>
        </article>
    );
}
