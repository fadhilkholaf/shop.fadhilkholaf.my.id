"use client";

import { OnApproveData } from "@paypal/paypal-js";
import { PayPalButtons } from "@paypal/react-paypal-js";

import { checkOutOrderAction } from "@/actions/order";

export default function CheckOutButton({ id }: { id: string }) {
    async function onApprove(data: OnApproveData) {
        const capture = await checkOutOrderAction(data.orderID);

        if (!capture.data || !capture.success) {
            throw new Error(capture.message);
        }
    }

    function onError(err: Record<string, unknown>) {
        console.log({ err, message: err.message });
    }

    return (
        <PayPalButtons
            createOrder={async function () {
                return id;
            }}
            onApprove={onApprove}
            onError={onError}
        />
    );
}
