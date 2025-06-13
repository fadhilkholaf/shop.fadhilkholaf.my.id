import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { getProduct } from "@/query/product";

import ProductDetailsPageHero from "./_components/ProductDetailsPageHero";

export default async function ProductPage({
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
        <main className="layout mt-32 flex flex-col gap-y-32">
            <ProductDetailsPageHero session={session} product={product} />
        </main>
    );
}
