"use server";

import { revalidatePath } from "next/cache";

import { Order } from "@paypal/paypal-server-sdk";

import { getCart } from "@/query/cart";
import { createOrder } from "@/query/order";
import { getAllProduct } from "@/query/product";
import {
    CartWithOrderAndProduct,
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
): Promise<ResponseTemplate<Order | null, unknown | null>> {
    try {
        const cart = (await getCart(
            { id: cartId },
            { order: true, products: true },
        )) as CartWithOrderAndProduct;

        if (cart.order) {
            return responseError("Cart order already captured!", null, null);
        }

        if (!cart.products.length) {
            return responseError("At lest one product in a cart!", null, null);
        }

        const existingProducts = await getAllProduct({
            id: {
                in: cart.products.map(function ({ id }) {
                    return id;
                }),
            },
        });

        if (existingProducts.length !== cart.products.length) {
            return responseError("Some product in cart not found!", null, null);
        }

        const createdPaypalOrder = await createPaypalOrder(existingProducts);

        if (!createdPaypalOrder) {
            return responseError(
                "Unexpected error creating paypal order!",
                null,
                null,
            );
        }

        revalidatePath("/", "layout");

        return responseSuccess("Order created!", createdPaypalOrder.result);
    } catch (error) {
        console.log(error);

        return responseError("Unexpected error creating order!", null, error);
    }
}

export async function captureOrderAction(
    id: string,
    cartId: number,
): Promise<
    ResponseTemplate<OrderWithCartWithProductAndUser | null, unknown | null>
> {
    try {
        const capturedPaypalOrder = await capturePaypalOrder(id);

        if (!capturedPaypalOrder.success || !capturedPaypalOrder.data) {
            return responseError(capturedPaypalOrder.message, null, null);
        }

        const createdOrder = (await createOrder(
            {
                orderId: capturedPaypalOrder.data.result.id || id,
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
                    return;
                }

                const gitHubUser = await getGitHubUserById(
                    createdOrder.cart.user.githubId,
                );

                if (!gitHubUser) {
                    return;
                }

                await addRepositoryCollaborator(
                    gitHubRepository.name,
                    gitHubUser.login,
                );
            }),
        );

        revalidatePath("/", "layout");

        return responseSuccess("Check out order success!", createdOrder);
    } catch (error) {
        console.log(error);

        return responseError(
            "Unexpected error checking out order!",
            null,
            error,
        );
    }
}
