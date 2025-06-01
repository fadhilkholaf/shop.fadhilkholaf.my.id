import {
    Client,
    Environment,
    OrdersController,
} from "@paypal/paypal-server-sdk";

const paypalClient = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.PAYPAL_CLIENT_ID,
        oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    },
    environment:
        process.env.APP_ENVIRONMENT === "production"
            ? Environment.Production
            : Environment.Sandbox,
});

export const paypalOrder = new OrdersController(paypalClient);
