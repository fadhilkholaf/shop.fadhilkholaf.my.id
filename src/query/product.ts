"use server";

import { Prisma } from "@/prisma/generated";

import prisma from "@/lib/prisma";
import { generatePublicId } from "@/utils/public-id";

export async function createProduct(
    data: Omit<Prisma.ProductCreateInput, "publicId">,
) {
    return await prisma.product.create({
        data: { publicId: generatePublicId(), ...data },
    });
}

export async function getAllProduct(where?: Prisma.ProductWhereInput) {
    return await prisma.product.findMany({ where });
}
