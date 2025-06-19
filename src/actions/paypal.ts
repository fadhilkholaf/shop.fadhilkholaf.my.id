"use server";

import {
    CheckoutPaymentIntent,
    ItemCategory,
    Order,
    PaypalWalletContextShippingPreference,
} from "@paypal/paypal-server-sdk";

import { paypalOrder } from "@/lib/paypal";
import { Product } from "@/prisma/generated";
import { ResponseTemplate } from "@/types/response";
import { responseError, responseSuccess } from "@/utils/response";

export async function createPaypalOrder(
    products: Product[],
): Promise<ResponseTemplate<Order, null> | ResponseTemplate<null, string>> {
    try {
        const totalPrice = products.reduce(function (acc, product) {
            return acc + product.price;
        }, 0);

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
                            value: totalPrice.toString(),
                            breakdown: {
                                itemTotal: {
                                    currencyCode: "USD",
                                    value: totalPrice.toString(),
                                },
                            },
                        },
                        items: products.map(function (product) {
                            return {
                                name: product.name,
                                category: ItemCategory.DigitalGoods,
                                quantity: "1",
                                unitAmount: {
                                    currencyCode: "USD",
                                    value: product.price.toString(),
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
            return responseError("Error creating PayPal order!");
        }

        return responseSuccess(response.result);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error creating PayPal order!");
    }
}

export async function capturePaypalOrder(
    id: string,
): Promise<ResponseTemplate<Order, null> | ResponseTemplate<null, string>> {
    try {
        const response = await paypalOrder.captureOrder({ id });

        if (response.statusCode >= 400) {
            return responseError("Error capturing PayPal order!");
        }

        return responseSuccess(response.result);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error capturing PayPal order!");
    }
}
