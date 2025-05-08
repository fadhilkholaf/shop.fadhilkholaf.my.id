"use server";

import { CheckoutPaymentIntent, ItemCategory } from "@paypal/paypal-server-sdk";

import { paypalOrder } from "@/lib/paypal";
import { Product } from "@/prisma/generated";
import { getAllProduct } from "@/query/product";

export async function createPaypalOrder(products: Product[]) {
    try {
        if (!products.length) {
            return null;
        }

        const existingProducts = await getAllProduct({
            id: {
                in: products.map(function ({ id }) {
                    return id;
                }),
            },
        });

        if (
            !existingProducts.length ||
            existingProducts.length !== products.length
        ) {
            return null;
        }

        const totalPrice = products.reduce(function (acc, product) {
            return acc + product.price;
        }, 0);

        const response = await paypalOrder.createOrder({
            body: {
                intent: CheckoutPaymentIntent.Capture,
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

        if (response.statusCode >= 300) {
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
