"use server";

import { revalidatePath } from "next/cache";

import { Order } from "@paypal/paypal-server-sdk";

import { auth } from "@/lib/auth";
import { getCart } from "@/database/cart";
import { createOrder } from "@/database/order";
import { getAllProduct } from "@/database/product";
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

export async function createOrderAction(
    cartId: number,
): Promise<ResponseTemplate<Order, null> | ResponseTemplate<null, string>> {
    try {
        const session = await auth();

        if (!session) {
            return responseError("Unauthenticated user!");
        }

        const cart = (await getCart(
            { id: cartId },
            { order: true, products: true, user: true },
        )) as CartWithOrderProductAndUser;

        if (cart.user.githubId !== session.user.githubId) {
            return responseError("Unauthotized user!");
        }

        if (cart.order) {
            return responseError("Cart order already captured");
        }

        if (!cart.products.length) {
            return responseError("At least one product in a cart!");
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

        if (!createdPaypalOrder.result) {
            return createdPaypalOrder;
        }

        revalidatePath("/", "layout");

        return responseSuccess(createdPaypalOrder.result);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error creating order!");
    }
}

export async function captureOrderAction(
    id: string,
    cartId: number,
): Promise<
    | ResponseTemplate<OrderWithCartWithProductAndUser, null>
    | ResponseTemplate<null, string>
> {
    try {
        const capturedPaypalOrder = await capturePaypalOrder(id);

        if (!capturedPaypalOrder.result) {
            return capturedPaypalOrder;
        }

        const createdOrder = (await createOrder(
            {
                orderId: capturedPaypalOrder.result.id || id,
                cart: { connect: { id: cartId } },
            },
            { cart: { include: { user: true, products: true } } },
        )) as OrderWithCartWithProductAndUser;

        await Promise.all(
            createdOrder.cart.products.map(async function (product) {
                const gitHubRepository = await getGitHubRepositoryById(
                    product.repositoryId,
                );

                if (!gitHubRepository.result) {
                    // TODO: Add a propper error handling

                    // throw new Error(
                    //     `Id: ${product.repositoryId}; ${gitHubRepository.error}`,
                    // );
                    return;
                }

                const gitHubUser = await getGitHubUserById(
                    createdOrder.cart.user.githubId,
                );

                if (!gitHubUser.result) {
                    // TODO: Add a propper error handling

                    // throw new Error(
                    //     `Id: ${createdOrder.cart.user.githubId}; ${gitHubUser.error}`,
                    // );
                    return;
                }

                await addRepositoryCollaborator(
                    gitHubRepository.result.name,
                    gitHubUser.result.login,
                );
            }),
        );

        revalidatePath("/", "layout");

        return responseSuccess(createdOrder);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error checking out order!");
    }
}
