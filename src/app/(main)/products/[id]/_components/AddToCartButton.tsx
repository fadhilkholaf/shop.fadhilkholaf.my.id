"use client";

import Form from "next/form";

import { addToCartAction } from "@/actions/cart";
// import { toast } from "@/components/Toast";
import { useCartModal } from "@/context/CartModalContext";
import { Product } from "@/prisma/generated";

export default function AddToCartButton({ product }: { product: Product }) {
    const { setIsOpen, setCartData } = useCartModal();

    return (
        <Form
            action={async function () {
                // const toastLoadingId = toast("Adding item to cart!", "loading");

                const response = await addToCartAction(product.id);

                if (response.error) {
                    // toast(response.error, "error", { id: toastLoadingId });

                    return;
                }

                setCartData(response.result);

                setIsOpen(true);

                // toast("Added to cart!", "success", { id: toastLoadingId });
            }}
        >
            <button type="submit">Add to cart</button>
        </Form>
    );
}
