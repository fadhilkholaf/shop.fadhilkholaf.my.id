"use client";

import Form from "next/form";
import { ReactNode } from "react";

import { addToCartAction } from "@/actions/cart";
import { useCartModal } from "@/context/CartModalContext";
import { Product } from "@/prisma/generated";

export default function AddToCartButton({
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
