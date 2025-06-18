import { Session } from "next-auth";

import {
    getGitHubRepositoryById,
    getGitHubUserById,
    getIsCollaborator,
} from "@/actions/octokit";
import CartButton from "@/components/buttons/CartModalButton";
import SignInButton from "@/components/buttons/SignInModalButton";
import { getAllOrder } from "@/database/order";
import { getAllCart } from "@/database/cart";
import { Product } from "@/prisma/generated";

import { AddToCartButton, RequestInvitationButton } from "./ActionButton";

export default async function ActionWrapper({
    session,
    product,
}: {
    session: Session | null;
    product: Product;
}) {
    if (!session) {
        return (
            <SignInButton className="w-full">
                <p className="bg-secondary text-primary w-full rounded-lg p-4 text-center">
                    Sign in 🔐
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
            <CartButton className="w-full">
                <p className="bg-secondary text-primary w-full rounded-lg p-4 text-center">
                    Check out ✌️
                </p>
            </CartButton>
        );
    }

    const gitHubRepository = await getGitHubRepositoryById(
        product.repositoryId,
    );

    if (!gitHubRepository.result) {
        return (
            <p className="bg-secondary text-primary cursor-not-allowed rounded-lg p-4 text-center">
                Not available! 🚫
            </p>
        );
    }

    if (gitHubRepository.result.visibility === "public") {
        return (
            <a
                href={gitHubRepository.result.html_url}
                target="_blank"
                className="bg-secondary text-primary inline-block w-full rounded-lg p-4 text-center"
            >
                View → 📃
            </a>
        );
    }

    const gitHubUser = await getGitHubUserById(session.user.githubId);

    if (!gitHubUser.result) {
        return null;
    }

    const isCollaborator = await getIsCollaborator(
        gitHubRepository.result.name,
        gitHubUser.result.login,
    );

    if (isCollaborator.result) {
        return (
            <a
                href={gitHubRepository.result.html_url}
                target="_blank"
                className="bg-secondary text-primary inline-block w-full rounded-lg p-4 text-center"
            >
                You own this. View → 📃
            </a>
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
                gitHubRepository={gitHubRepository.result}
                gitHubUser={gitHubUser.result}
            />
        );
    }

    return (
        <AddToCartButton product={product}>
            <p className="bg-secondary text-primary w-full rounded-lg p-4 text-center">
                Add to cart 🛒
            </p>
        </AddToCartButton>
    );
}
