"use client";

import { addToCartAction } from "@/actions/cart";
import { useCartModal } from "@/context/CartModalContext";
import { Prisma, Product } from "@/prisma/generated";
import Form from "next/form";

export default function AddToCartButton({ product }: { product: Product }) {
    const { setIsOpen, setCartData } = useCartModal();

    return (
        <Form
            action={async function () {
                const response = await addToCartAction(product);

                if (!response.success) {
                    return;
                }

                setCartData(
                    response.data as Prisma.CartGetPayload<{
                        include: { products: true };
                    }>,
                );

                setIsOpen(true);
            }}
        >
            <button type="submit">Add to cart</button>
        </Form>
    );
}
