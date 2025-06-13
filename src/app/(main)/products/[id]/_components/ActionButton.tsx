"use client";

import Form from "next/form";
import { ReactNode } from "react";

import { addToCartAction } from "@/actions/cart";
import { addRepositoryCollaborator } from "@/actions/octokit";
import { useCartModal } from "@/context/CartModalContext";
import { Product } from "@/prisma/generated";
import { GitHubRepository, GitHubUser } from "@/types/octokit";

export function AddToCartButton({
    children,
    product,
}: {
    children: ReactNode;
    product: Product;
}) {
    const { setIsOpen, setCartData } = useCartModal();

    return (
        <Form
            action={async function () {
                const response = await addToCartAction(product.id);

                if (response.error) {
                    return;
                }

                setCartData(response.result);

                setIsOpen(true);
            }}
        >
            <button type="submit" className="w-full">
                {children}
            </button>
        </Form>
    );
}

export function RequestInvitationButton({
    gitHubRepository,
    gitHubUser,
}: {
    gitHubRepository: GitHubRepository["data"];
    gitHubUser: GitHubUser["data"];
}) {
    return (
        <Form
            action={async function () {
                const response = await addRepositoryCollaborator(
                    gitHubRepository.name,
                    gitHubUser.login,
                );

                if (!response.result) {
                    return;
                }

                window.open(response.result.html_url, "_blank");
            }}
        >
            <button type="submit" className="w-full">
                <p className="bg-secondary text-primary w-full rounded-lg p-4 text-center">
                    Request invitation
                </p>
            </button>
        </Form>
    );
}
