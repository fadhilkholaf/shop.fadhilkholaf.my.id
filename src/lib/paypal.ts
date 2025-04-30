import { core } from "@paypal/checkout-server-sdk";

function paypalEnvironment() {
    return new core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET,
    );
}

export function paypalClient() {
    return new core.PayPalHttpClient(paypalEnvironment());
}
