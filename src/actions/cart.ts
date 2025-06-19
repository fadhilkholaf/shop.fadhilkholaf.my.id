"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { createCart, getAllCart, updateCart } from "@/database/cart";
import { getProduct } from "@/database/product";
import { CartWithOrder, CartWithProduct } from "@/types/prisma-relations";
import { ResponseTemplate } from "@/types/response";
import { responseError, responseSuccess } from "@/utils/response";

export async function addToCartAction(
    productId: number,
): Promise<
    ResponseTemplate<CartWithProduct, null> | ResponseTemplate<null, string>
> {
    try {
        const session = await auth();

        if (!session) {
            return responseError("Unauthorized user!");
        }

        const product = await getProduct({ id: productId });

        if (!product) {
            return responseError("Product not found!");
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
        )) as CartWithOrder[];

        if (!availableCart.length) {
            const createdCart = (await createCart(
                {
                    user: { connect: { githubId: session.user.githubId } },
                    products: { connect: { id: product.id } },
                },
                { products: true },
            )) as CartWithProduct;

            return responseSuccess(createdCart);
        }

        const updatedCart = (await updateCart(
            { id: availableCart[0].id },
            { products: { connect: { id: product.id } } },
            { products: true },
        )) as CartWithProduct;

        revalidatePath("/", "layout");

        return responseSuccess(updatedCart);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error adding cart item!");
    }
}

export async function removeCartItemAction(
    cartId: number,
    productId: number,
): Promise<
    ResponseTemplate<CartWithProduct, null> | ResponseTemplate<null, string>
> {
    try {
        const updatedCart = (await updateCart(
            { id: cartId },
            { products: { disconnect: { id: productId } } },
            { products: true },
        )) as CartWithProduct;

        revalidatePath("/", "layout");

        return responseSuccess(updatedCart);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error removing cart item!");
    }
}
