import {
    Client,
    Environment,
    OrdersController,
} from "@paypal/paypal-server-sdk";

const paypalEnvironment =
    process.env.NODE_ENV === "production"
        ? Environment.Production
        : Environment.Sandbox;

const paypalClient = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.PAYPAL_CLIENT_ID,
        oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    },
    environment: paypalEnvironment,
});

export const paypalOrder = new OrdersController(paypalClient);
