import Image from "next/image";
import { notFound } from "next/navigation";

import { getProduct } from "@/query/product";
import Form from "next/form";
import { auth, signIn } from "@/lib/auth";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { Product } from "@/prisma/generated";
import { addToCartAction } from "@/actions/cart";

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
        <>
            <h1>{product.name}</h1>
            <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
                className="h-fit w-full object-cover"
            />
            <Action session={session} product={product} />
        </>
    );
}

function Action({
    session,
    product,
}: {
    session: Session | null;
    product: Product;
}) {
    if (!session) {
        return (
            <Form
                action={async function () {
                    "use server";

                    await signIn("github", { redirect: true });

                    revalidatePath("/", "layout");
                }}
            >
                <button type="submit">Please sign in before buying!</button>
            </Form>
        );
    }

    return (
        <>
            <Form
                action={async function () {
                    "use server";

                    const response = await addToCartAction(product);

                    console.log(response);
                }}
            >
                <button type="submit">Add to cart</button>
            </Form>
            {/* <Form
                action={async function () {
                    "use server";
                }}
            >
                <button type="submit">Buy</button>
            </Form> */}
        </>
    );
}
