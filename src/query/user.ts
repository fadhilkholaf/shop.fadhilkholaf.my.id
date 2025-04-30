"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@/prisma/generated";
import { generatePublicId } from "@/utils/public-id";

export async function createUser(
    data: Omit<Prisma.UserCreateInput, "publicId">,
) {
    return await prisma.user.create({
        data: { publicId: generatePublicId(), ...data },
    });
}

export async function getAllUser() {
    return await prisma.user.findMany();
}

export async function getUser(where: Prisma.UserWhereUniqueInput) {
    return await prisma.user.findUnique({ where });
}

export async function updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
) {
    return await prisma.user.update({ where, data });
}

export async function deleteUser(where: Prisma.UserWhereUniqueInput) {
    return await prisma.user.delete({ where });
}
