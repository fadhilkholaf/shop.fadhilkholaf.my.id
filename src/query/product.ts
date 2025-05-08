"use server";

import { Prisma } from "@/prisma/generated";

import prisma from "@/lib/prisma";

export async function createProduct(data: Prisma.ProductCreateInput) {
    return await prisma.product.create({
        data,
    });
}

export async function getProduct(where: Prisma.ProductWhereUniqueInput) {
    return await prisma.product.findUnique({ where });
}

export async function getAllProduct(where?: Prisma.ProductWhereInput) {
    return await prisma.product.findMany({ where });
}
