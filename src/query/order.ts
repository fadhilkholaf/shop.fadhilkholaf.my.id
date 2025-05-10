"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@/prisma/generated";
import { generatePublicId } from "@/utils/public-id";

export async function createOrder(
    data: Omit<Prisma.OrderCreateInput, "publicId">,
    include?: Prisma.OrderInclude,
) {
    return await prisma.order.create({
        data: { publicId: generatePublicId(), ...data },
        include,
    });
}

export async function getAllOrder(where?: Prisma.OrderWhereInput) {
    return await prisma.order.findMany({ where });
}

export async function updateOrder(
    where: Prisma.OrderWhereUniqueInput,
    data: Prisma.OrderUpdateInput,
) {
    return await prisma.order.update({ where, data });
}
