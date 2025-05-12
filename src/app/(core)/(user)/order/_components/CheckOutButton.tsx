"use client";

import { OnApproveData } from "@paypal/paypal-js";
import { PayPalButtons } from "@paypal/react-paypal-js";

import { captureOrderAction, createOrderAction } from "@/actions/order";
import { Prisma } from "@/prisma/generated";

export default function CheckOutButton({
    cart,
}: {
    cart: Prisma.CartGetPayload<{ include: { products: true } }>;
}) {
    async function createOrder() {
        const response = await createOrderAction(cart);

        if (!response.success || !response.data || !response.data.id) {
            throw new Error(response.message);
        }

        return response.data.id;
    }

    async function onApprove(data: OnApproveData) {
        const capture = await captureOrderAction(data.orderID, cart);

        if (!capture.data || !capture.success) {
            throw new Error(capture.message);
        }
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
