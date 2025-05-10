"use server";

import { revalidatePath } from "next/cache";

import { Cart, Prisma } from "@/prisma/generated";
import { createOrder } from "@/query/order";
import { getAllProduct } from "@/query/product";

import { capturePaypalOrder, createPaypalOrder } from "./paypal";
import {
    addRepositoryCollaborator,
    getGitHubRepositoryById,
    getGitHubUserById,
} from "./octokit";

export async function createOrderAction(
    cart: Prisma.CartGetPayload<{ include: { products: true } }>,
) {
    try {
        if (!cart.products.length) {
            return {
                success: false,
                message: "At lest one product in a cart!",
                data: null,
            };
        }

        const existingProducts = await getAllProduct({
            id: {
                in: cart.products.map(function ({ id }) {
                    return id;
                }),
            },
        });

        if (existingProducts.length !== cart.products.length) {
            return {
                success: false,
                message: "Some product in cart not found!",
                data: null,
            };
        }

        const createdPaypalOrder = await createPaypalOrder(existingProducts);

        if (!createdPaypalOrder) {
            return {
                success: false,
                message: "Unexpected error creating paypal order!",
                data: null,
            };
        }

        revalidatePath("/", "layout");

        return {
            success: true,
            message: "Order created!",
            data: createdPaypalOrder.result,
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: "Unexpected error creating order!",
            data: null,
        };
    }
}

export async function captureOrderAction(id: string, cart: Cart) {
    try {
        const capturedPaypalOrder = await capturePaypalOrder(id);

        if (!capturedPaypalOrder.success || !capturedPaypalOrder.data) {
            return capturedPaypalOrder;
        }

        const createdOrder = (await createOrder(
            {
                orderId: capturedPaypalOrder.data.result.id || id,
                cart: { connect: { id: cart.id } },
            },
            { cart: { include: { user: true, products: true } } },
        )) as Prisma.OrderGetPayload<{
            include: { cart: { include: { user: true; products: true } } };
        }>;

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

                const response = await addRepositoryCollaborator(
                    gitHubRepository.name,
                    gitHubUser.login,
                );

                console.log(response);
            }),
        );

        revalidatePath("/", "layout");

        return {
            success: true,
            message: "Check out order success!",
            data: createdOrder,
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: "Unexpected error checking out order!",
            data: null,
        };
    }
}
