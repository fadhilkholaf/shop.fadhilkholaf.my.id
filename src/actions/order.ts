"use server";

import { revalidatePath } from "next/cache";

import { Order } from "@paypal/paypal-server-sdk";

import { getCart } from "@/query/cart";
import { createOrder } from "@/query/order";
import { getAllProduct } from "@/query/product";
import {
    CartWithOrderProductAndUser,
    OrderWithCartWithProductAndUser,
} from "@/types/prisma-relations";
import { ResponseTemplate } from "@/types/response";
import { responseError, responseSuccess } from "@/utils/response";

import {
    addRepositoryCollaborator,
    getGitHubRepositoryById,
    getGitHubUserById,
} from "./octokit";
import { capturePaypalOrder, createPaypalOrder } from "./paypal";
import { auth } from "@/lib/auth";

export async function createOrderAction(
    cartId: number,
): Promise<ResponseTemplate<Order | null, string | null>> {
    try {
        const session = await auth();

        if (!session) {
            return responseError("Unauthenticated!");
        }

        const cart = (await getCart(
            { id: cartId },
            { order: true, products: true, user: true },
        )) as CartWithOrderProductAndUser;

        if (cart.user.githubId !== session.user.githubId) {
            return responseError("Forbidden!");
        }

        if (cart.order) {
            return responseError("Cart order already captured");
        }

        if (!cart.products.length) {
            return responseError("At lest one product in a cart!");
        }

        const existingProducts = await getAllProduct({
            id: {
                in: cart.products.map(function ({ id }) {
                    return id;
                }),
            },
        });

        if (existingProducts.length !== cart.products.length) {
            return responseError("Some product in cart not found!");
        }

        const createdPaypalOrder = await createPaypalOrder(existingProducts);

        if (!createdPaypalOrder) {
            return responseError("Unexpected error creating paypal order!");
        }

        revalidatePath("/", "layout");

        return responseSuccess(createdPaypalOrder.result);
    } catch (error) {
        console.log(error);

        return responseError("Unexpected error creating order!");
    }
}

export async function captureOrderAction(
    id: string,
    cartId: number,
): Promise<
    ResponseTemplate<OrderWithCartWithProductAndUser | null, string | null>
> {
    try {
        const capturedPaypalOrder = await capturePaypalOrder(id);

        if (capturedPaypalOrder.error) {
            return responseError(capturedPaypalOrder.error);
        }

        const createdOrder = (await createOrder(
            {
                orderId: capturedPaypalOrder.result?.id || id,
                cart: { connect: { id: cartId } },
            },
            { cart: { include: { user: true, products: true } } },
        )) as OrderWithCartWithProductAndUser;

        await Promise.all(
            createdOrder.cart.products.map(async function (product) {
                const gitHubRepository = await getGitHubRepositoryById(
                    product.repositoryId,
                );

                if (!gitHubRepository) {
                    throw new Error(
                        `GitHub repository with id ${product.repositoryId} not found!`,
                    );
                }

                const gitHubUser = await getGitHubUserById(
                    createdOrder.cart.user.githubId,
                );

                if (!gitHubUser) {
                    throw new Error(`GitHub user not found!`);
                }

                await addRepositoryCollaborator(
                    gitHubRepository.name,
                    gitHubUser.login,
                );
            }),
        );

        revalidatePath("/", "layout");

        return responseSuccess(createdOrder);
    } catch (error) {
        console.log(error);

        return responseError("Unexpected error checking out order!");
    }
}
