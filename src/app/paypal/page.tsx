"use client";

import { useEffect, useState } from "react";

import { PayPalButtons } from "@paypal/react-paypal-js";

import { capturePaypalOrder, createPaypalOrder } from "@/actions/paypal";
import { getAllProduct } from "@/query/product";
import { Product } from "@/prisma/generated";

export default function PaypalPage() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(function () {
        async function handleSetProducts() {
            const existingProducts = await getAllProduct();

            setProducts(existingProducts);
        }

        handleSetProducts();
    }, []);

    async function createOrder() {
        const order = await createPaypalOrder(products);

        if (!order || !order.result.id) {
            throw new Error("Something went wrong while creating order!");
        }

        return order.result.id;
    }

    async function onApprove(data: any) {
        const capture = await capturePaypalOrder(data.orderID);

        if (!capture) {
            throw new Error("Something went wrong while capturing order!");
        }
    }

    function onError(err: Record<string, unknown>) {
        console.log({ err });
    }

    return (
        <main>
            <header>
                <h1>Paypal</h1>
            </header>
            <main>
                <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                />
                <ul className="mt-16">
                    {products.map(function (product, i) {
                        return (
                            <li key={i}>
                                <p>{product.id}</p>
                                <PayPalButtons
                                    createOrder={async function () {
                                        const order = await createPaypalOrder([
                                            product,
                                        ]);
                                        if (!order || !order.result.id) {
                                            throw new Error(
                                                "Something went wrong while creating order!",
                                            );
                                        }

                                        return order.result.id;
                                    }}
                                    onApprove={onApprove}
                                    onError={onError}
                                />
                            </li>
                        );
                    })}
                </ul>
            </main>
        </main>
    );
}
