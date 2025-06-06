import Image from "next/image";

import { Product as P } from "@/prisma/generated";
import { formatUsd } from "@/utils/format";

export default function Product({ product }: { product: P }) {
    return (
        <article className="flex h-full flex-col gap-y-2">
            <header className="flex flex-col gap-y-2">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={1024}
                    height={1024}
                    priority
                    className="aspect-video w-full rounded-lg object-cover"
                />
            </header>
            <main className="flex h-full flex-col justify-between gap-y-2">
                <div>
                    <p>Website template • Category • Front-end</p>
                    <h5>{product.name}</h5>
                </div>
                <p className="font-mono">{formatUsd(product.price)} USD</p>
            </main>
            <footer>
                <h5 className="flex w-full justify-between">
                    <span>Details</span>
                    <span>→</span>
                </h5>
            </footer>
        </article>
    );
}
