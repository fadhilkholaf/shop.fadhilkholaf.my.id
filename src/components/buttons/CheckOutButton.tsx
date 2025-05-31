"use client";

import { OnApproveData } from "@paypal/paypal-js";
import { PayPalButtons } from "@paypal/react-paypal-js";

import { captureOrderAction, createOrderAction } from "@/actions/order";
import { useCartModal } from "@/context/CartModalContext";
import { Prisma } from "@/prisma/generated";

export default function CheckOutButton({
    cart,
}: {
    cart: Prisma.CartGetPayload<{ include: { products: true } }>;
}) {
    const { setIsOpen, setCartData } = useCartModal();

    async function createOrder() {
        const response = await createOrderAction(cart.id);

        if (response.error) {
            throw new Error(response.error);
        }

        return response.result?.id || "";
    }

    async function onApprove(data: OnApproveData) {
        const capture = await captureOrderAction(data.orderID, cart.id);

        if (capture.error) {
            throw new Error(capture.error);
        }

        setCartData(null);
        setIsOpen(false);
    }

    function onError(err: Record<string, unknown>) {
        console.log({ err, message: err.message });
    }

    return (
        <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            style={{
                layout: "horizontal",
                label: "checkout",
                color: "gold",
                tagline: false,
                disableMaxWidth: true,
                borderRadius: 8,
            }}
        />
    );
}
