import Form from "next/form";

import { Session } from "next-auth";

import {
    addRepositoryCollaborator,
    getGitHubRepositoryById,
    getGitHubUserById,
    getIsCollaborator,
} from "@/actions/octokit";
import CartButton from "@/components/buttons/CartButton";
import SignInButton from "@/components/buttons/SignInButton";
import { Product } from "@/prisma/generated";
import { getAllOrder } from "@/query/order";
import { getAllCart } from "@/query/cart";

import AddToCartButton from "./AddToCartButton";
import RequestInvitationButton from "./RequestInvitationButton";

export default async function ActionWrapper({
    session,
    product,
}: {
    session: Session | null;
    product: Product;
}) {
    if (!session) {
        return (
            <SignInButton>
                <p className="bg-secondary text-primary w-full rounded-lg p-4 text-center">
                    Sign in
                </p>
            </SignInButton>
        );
    }

    const isOnCart = await getAllCart({
        user: { githubId: session.user.githubId },
        order: null,
        products: { some: { id: product.id } },
    });

    if (isOnCart.length) {
        return (
            <CartButton>
                <p className="bg-secondary text-primary w-full rounded-lg p-4 text-center">
                    Check out
                </p>
            </CartButton>
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
            <p className="bg-secondary text-primary w-full rounded-lg p-4 text-center">
                Already a collaborator
            </p>
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
            <RequestInvitationButton
                gitHubRepository={gitHubRepository}
                gitHubUser={gitHubUser}
            />
        );
    }

    return (
        <AddToCartButton product={product}>
            <p className="bg-secondary text-primary w-full rounded-lg p-4 text-center">
                Add to cart
            </p>
        </AddToCartButton>
    );
}
