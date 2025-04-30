"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";

import { capturePaypalOrder, createPaypalOrder } from "@/actions/paypal";

export default function PaypalPage() {
    return (
        <main>
            <header>
                <h1>Paypal</h1>
            </header>
            <main>
                <PayPalButtons
                    createOrder={async () => {
                        // "use server";
                        const order = await createPaypalOrder();
                        console.log(order);

                        return order?.result.id + "";
                    }}
                    onApprove={async (data) => {
                        // "use server";
                        const response = await capturePaypalOrder(data.orderID);
                        console.log(response);

                        // if (response) return true;
                    }}
                />
            </main>
        </main>
    );
}
