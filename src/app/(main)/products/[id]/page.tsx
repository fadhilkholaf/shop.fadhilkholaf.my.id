import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { getProduct } from "@/query/product";

import Hero from "./_components/ProductDetailsPageHero";

export default async function ProductDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const product = await getProduct({ publicId: id });

    if (!product) {
        notFound();
    }

    const session = await auth();

    return (
        <main className="layout mt-16 flex flex-col gap-y-16 md:gap-y-32">
            <Hero session={session} product={product} />
        </main>
    );
}
