"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { Prisma, Product } from "@/prisma/generated";
import { createCart, getAllCart, updateCart } from "@/query/cart";
import { responseError, responseSuccess } from "@/utils/response";

export async function addToCartAction(product: Product) {
    try {
        const session = await auth();

        if (!session) {
            return {
                success: false,
                message: "Unauthenticated!",
                data: null,
            };
        }

        const availableCart = (await getAllCart(
            {
                AND: [
                    { user: { githubId: session.user.githubId } },
                    {
                        order: null,
                    },
                ],
            },
            { order: true },
        )) as Prisma.CartGetPayload<{ include: { order: true } }>[];

        if (!availableCart.length) {
            const createdCart = (await createCart(
                {
                    user: { connect: { githubId: session.user.githubId } },
                    products: { connect: { id: product.id } },
                },
                { products: true },
            )) as Prisma.CartGetPayload<{ include: { products: true } }>;

            return {
                success: true,
                message: "Product added to cart!",
                data: createdCart,
            };
        }

        const updatedCart = (await updateCart(
            { id: availableCart[0].id },
            { products: { connect: { id: product.id } } },
            { products: true },
        )) as Prisma.CartGetPayload<{ include: { products: true } }>;

        revalidatePath("/", "layout");

        return {
            success: true,
            message: "Product added to cart!",
            data: updatedCart,
        };
    } catch (error) {
        console.log(error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return {
                    success: false,
                    message: error.message,
                    data: null,
                };
            }
        }

        return {
            success: false,
            message: "Unexpected error adding to cart!",
            data: null,
        };
    }
}

export async function removeCartItemAction(cartId: number, productId: number) {
    try {
        const updatedCart = (await updateCart(
            { id: cartId },
            { products: { disconnect: { id: productId } } },
            { products: true },
        )) as Prisma.CartGetPayload<{ include: { products: true } }>;

        revalidatePath("/", "layout");

        return responseSuccess("Success removing item!", updatedCart);
    } catch (error) {
        console.log(error);

        return responseError("Error removing cart item!", null, error);
    }
}
