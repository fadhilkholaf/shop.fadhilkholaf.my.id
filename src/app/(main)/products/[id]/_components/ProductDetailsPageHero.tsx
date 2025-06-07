import Image from "next/image";
import { Suspense } from "react";

import { Session } from "next-auth";

import { Product } from "@/prisma/generated";
import { formatDate, formatUsd } from "@/utils/format";

import ActionWrapper from "./ActionWrapper";

export default function ProductDetailsPageHero({
    session,
    product,
}: {
    session: Session | null;
    product: Product;
}) {
    return (
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <header>
                <Image
                    src={product.image}
                    alt={product.name}
                    width={1024}
                    height={1024}
                    priority
                    className="aspect-video w-full rounded-lg object-cover"
                />
            </header>
            <main className="flex flex-col gap-y-8">
                <header>
                    <p>{formatDate(product.createdAt)}</p>
                    <h3>{product.name}</h3>
                </header>
                <main>
                    <h6 className="font-mono font-normal">
                        {formatUsd(product.price)}
                    </h6>
                </main>
                <footer>
                    <Suspense
                        fallback={
                            <p className="bg-secondary text-primary w-full rounded-lg p-4 text-center">
                                Checking availability
                            </p>
                        }
                    >
                        <ActionWrapper session={session} product={product} />
                    </Suspense>
                </footer>
            </main>
        </section>
    );
}
