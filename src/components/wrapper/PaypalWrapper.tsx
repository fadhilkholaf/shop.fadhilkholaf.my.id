"use client";

import { ReactNode } from "react";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PaypalWrapper({ children }: { children: ReactNode }) {
    return (
        <PayPalScriptProvider
            options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                currency: "USD",
                intent: "capture",
                components: "buttons,card-fields",
            }}
        >
            {children}
        </PayPalScriptProvider>
    );
}
