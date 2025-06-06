"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@/prisma/generated";
import { generatePublicId } from "@/utils/public-id";

export async function createCart(
    data: Omit<Prisma.CartCreateInput, "publicId">,
    include?: Prisma.CartInclude,
) {
    return await prisma.cart.create({
        data: { publicId: generatePublicId(), ...data },
        include,
    });
}

export async function getCart(
    where: Prisma.CartWhereUniqueInput,
    include?: Prisma.CartInclude,
) {
    return await prisma.cart.findUnique({ where, include });
}

export async function getAllCart(
    where?: Prisma.CartWhereInput,
    include?: Prisma.CartInclude,
) {
    return await prisma.cart.findMany({ where, include });
}

export async function updateCart(
    where: Prisma.CartWhereUniqueInput,
    data: Prisma.CartUpdateInput,
    include?: Prisma.CartInclude,
) {
    return prisma.cart.update({ where, data, include });
}
