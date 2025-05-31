"use client";

import Form from "next/form";

import { addToCartAction } from "@/actions/cart";
import { useCartModal } from "@/context/CartModalContext";
import { Product } from "@/prisma/generated";

export default function AddToCartButton({ product }: { product: Product }) {
    const { setIsOpen, setCartData } = useCartModal();

    return (
        <Form
            action={async function () {
                const response = await addToCartAction(product.id);

                if (response.error) {
                    alert(response.error);

                    return;
                }

                setCartData(response.result);

                setIsOpen(true);
            }}
        >
            <button type="submit">Add to cart</button>
        </Form>
    );
}
