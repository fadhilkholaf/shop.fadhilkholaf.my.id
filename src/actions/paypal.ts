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
                            value: (totalPrice + totalTax).toFixed(2),
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

export async function capturePaypalOrder(
    id: string,
): Promise<ResponseTemplate<Order | null, string | null>> {
    try {
        const response = await paypalOrder.captureOrder({ id });

        if (response.statusCode >= 400) {
            return responseError("Error capturing order!");
        }

        return responseSuccess(response.result);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error capturing order!");
    }
}
