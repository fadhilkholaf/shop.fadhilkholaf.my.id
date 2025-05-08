"use server";

import { Prisma } from "@/prisma/generated";
import { createOrder, updateOrder } from "@/query/order";

import { capturePaypalOrder, createPaypalOrder } from "./paypal";
import { revalidatePath } from "next/cache";

export async function createOrderAction(
    cart: Prisma.CartGetPayload<{ include: { products: true } }>,
) {
    try {
        const createdPaypalOrder = await createPaypalOrder(cart.products);

        if (!createdPaypalOrder) {
            return {
                success: false,
                message: "Unexpected error creating paypal order!",
                data: null,
            };
        }

        const createdOrder = await createOrder({
            cart: { connect: { id: cart.id } },
            status: "unpaid",
            orderId: createdPaypalOrder.result.id!,
        });

        revalidatePath("/", "layout");

        return {
            success: true,
            message: "Order created!",
            data: createdOrder,
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: "Unexpected error creating order!",
            data: null,
        };
    }
}

export async function checkOutOrderAction(id: string) {
    try {
        const capturedPaypalOrder = await capturePaypalOrder(id);

        if (!capturedPaypalOrder.success || !capturedPaypalOrder.data) {
            return capturedPaypalOrder;
        }

        const updatedOrder = await updateOrder(
            { orderId: capturedPaypalOrder.data.result.id },
            { status: "paid" },
        );

        revalidatePath("/", "layout");

        return {
            success: true,
            message: "Check out order success!",
            data: updatedOrder,
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: "Unexpected error checking out order!",
            data: null,
        };
    }
}
