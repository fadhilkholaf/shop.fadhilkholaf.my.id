import Image from "next/image";
import { Suspense } from "react";

import { Session } from "next-auth";

import { Product } from "@/prisma/generated";
import { formatDate, formatUsd } from "@/utils/format";

import ActionWrapper from "./ActionWrapper";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function ProductDetailsPageHero({
    session,
    product,
}: {
    session: Session | null;
    product: Product;
}) {
    return (
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <header className="bg-secondary rounded-2xl p-2 md:rounded-3xl md:p-4">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={1024}
                    height={1024}
                    priority
                    className="aspect-video w-full rounded-lg object-cover"
                />
            </header>
            <main className="flex flex-col gap-y-4">
                <header>
                    <p>{formatDate(product.createdAt)}</p>
                    <h1>{product.name}</h1>
                </header>
                <main>
                    <p className="font-mono">{formatUsd(product.price)}</p>
                </main>
                <footer>
                    <Suspense
                        fallback={
                            <p className="bg-secondary text-primary w-full cursor-wait rounded-lg p-4 text-center">
                                Checking availability
                            </p>
                        }
                    >
                        <ActionWrapper session={session} product={product} />
                    </Suspense>
                </footer>
            </main>
            <footer className="md:col-span-2">
                <MarkdownRenderer>{product.description}</MarkdownRenderer>
            </footer>
        </section>
    );
}
