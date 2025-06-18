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

export async function getAllProduct(
    where?: Prisma.ProductWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.ProductOrderByWithRelationInput,
) {
    return await prisma.product.findMany({ where, skip, take, orderBy });
}

export async function getAllProductLength() {
    return await prisma.product.count();
}

// export async function getSoldProduct() {
//     return await prisma.product.findMany({
//         where: { carts: { none: { order: null } } },
//         include: { _count: true },
//     });
// }

export async function updateProduct(
    where: Prisma.ProductWhereUniqueInput,
    data: Prisma.ProductUpdateInput,
) {
    return await prisma.product.update({ where, data });
}

export async function deleteProduct(where: Prisma.ProductWhereUniqueInput) {
    return await prisma.product.delete({ where });
}
