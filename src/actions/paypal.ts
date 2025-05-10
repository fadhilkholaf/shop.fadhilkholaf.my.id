"use server";

import {
    CheckoutPaymentIntent,
    ItemCategory,
    PaypalWalletContextShippingPreference,
} from "@paypal/paypal-server-sdk";

import { paypalOrder } from "@/lib/paypal";
import { Product } from "@/prisma/generated";

export async function createPaypalOrder(products: Product[]) {
    try {
        const totalPrice = products.reduce(function (acc, product) {
            return acc + product.price;
        }, 0);
        const factor = Math.pow(10, 2);
        const totalTax = Math.round(totalPrice * 0.12 * factor) / factor;

        const response = await paypalOrder.createOrder({
            body: {
                intent: CheckoutPaymentIntent.Capture,
                paymentSource: {
                    paypal: {
                        experienceContext: {
                            shippingPreference:
                                PaypalWalletContextShippingPreference.NoShipping,
                        },
                    },
                },
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: "USD",
                            value: (totalPrice + totalTax).toString(),
                            breakdown: {
                                itemTotal: {
                                    currencyCode: "USD",
                                    value: totalPrice.toString(),
                                },
                                taxTotal: {
                                    currencyCode: "USD",
                                    value: totalTax.toString(),
                                },
                            },
                        },
                        items: products.map(function (product) {
                            const price = product.price;
                            const tax =
                                Math.round(product.price * 0.12 * factor) /
                                factor;

                            return {
                                name: product.name,
                                category: ItemCategory.DigitalGoods,
                                quantity: "1",
                                unitAmount: {
                                    currencyCode: "USD",
                                    value: price.toString(),
                                },
                                tax: {
                                    currencyCode: "USD",
                                    value: tax.toString(),
                                },
                                imageUrl: product.image,
                                url: `https://shop.fadhilkholaf.my.id/products/${product.publicId}`,
                            };
                        }),
                    },
                ],
            },
        });

        if (response.statusCode >= 400) {
            return null;
        }

        return response;
    } catch (error) {
        console.error(error);

        return null;
    }
}

export async function capturePaypalOrder(id: string) {
    try {
        const response = await paypalOrder.captureOrder({ id });

        if (response.statusCode >= 400) {
            return {
                success: false,
                message: "Error capturing order!",
                data: null,
            };
        }

        return {
            success: true,
            message: "Capture order success!",
            data: response,
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Unexpected error capturing order!",
            data: null,
        };
    }
}
