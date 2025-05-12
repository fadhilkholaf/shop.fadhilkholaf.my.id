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
            {/* <IsCollaborator session={session} product={product} /> */}
            <h1>{product.name}</h1>
            <Image
                src={product.image}
                alt={product.name}
                width={1024}
                height={1024}
                className="h-fit w-full object-cover"
            />
            <Action session={session} product={product} />
        </>
    );
}

async function IsCollaborator({
    session,
    product,
}: {
    session: Session | null;
    product: Product;
}) {
    if (!session) {
        return null;
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

    return <h1>Is Collaborator: {isCollaborator}</h1>;
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
