import Image from "next/image";
import { notFound } from "next/navigation";

import { getProduct } from "@/query/product";
import Form from "next/form";
import { auth, signIn } from "@/lib/auth";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { Product } from "@/prisma/generated";
import { addToCartAction } from "@/actions/cart";
import {
    addRepositoryCollaborator,
    getGitHubRepositoryById,
    getGitHubUserById,
    getIsCollaborator,
} from "@/actions/octokit";
import { getAllOrder } from "@/query/order";
import { getAllCart } from "@/query/cart";
import AddToCartButton from "./_components/AddToCartButton";
import { Suspense } from "react";
import CartButton from "@/components/buttons/CartButton";

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
        <main className="layout my-32">
            {/* <IsCollaborator session={session} product={product} /> */}
            <h1>{product.name}</h1>
            <Image
                src={product.image}
                alt={product.name}
                width={1024}
                height={1024}
                priority
                className="h-fit w-full object-cover"
            />
            <Suspense fallback={<p>Checking availability!</p>}>
                <Action session={session} product={product} />
            </Suspense>
        </main>
    );
}

async function Action({
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

    const gitHubRepository = await getGitHubRepositoryById(
        product.repositoryId,
    );

    if (!gitHubRepository) {
        return null;
    }

    const gitHubUser = await getGitHubUserById(session.user.githubId);

    if (!gitHubUser) {
        return null;
    }

    const isCollaborator = await getIsCollaborator(
        gitHubRepository.name,
        gitHubUser.login,
    );

    if (isCollaborator) {
        return (
            <>
                <p>You are already a collaborator to this repo</p>
            </>
        );
    }

    const isOrdered = await getAllOrder({
        cart: {
            user: { githubId: session.user.githubId },
            products: { some: { id: product.id } },
        },
    });

    if (isOrdered.length) {
        return (
            <>
                <p>Already ordered this product</p>
                <Form
                    action={async function () {
                        "use server";

                        const response = await addRepositoryCollaborator(
                            gitHubRepository.name,
                            gitHubUser.login,
                        );

                        console.log(response);
                    }}
                >
                    <button type="submit">Request invitations</button>
                </Form>
            </>
        );
    }

    const isOnCart = await getAllCart({
        user: { githubId: session.user.githubId },
        order: null,
        products: { some: { id: product.id } },
    });

    return (
        <>
            {!isOnCart.length ? (
                <AddToCartButton product={product} />
            ) : (
                <CartButton>Open cart</CartButton>
            )}
        </>
    );
}
