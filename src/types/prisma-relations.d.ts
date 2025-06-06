import { Prisma } from "@/prisma/generated";

export type CartWithProduct = Prisma.CartGetPayload<{
    include: { products: true };
}>;

export type CartWithOrder = Prisma.CartGetPayload<{
    include: { order: true };
}>;

export type CartWithOrderAndProduct = Prisma.CartGetPayload<{
    include: { order: true; products: true };
}>;
export type CartWithOrderProductAndUser = Prisma.CartGetPayload<{
    include: { order: true; products: true; user: true };
}>;

export type OrderWithCartWithProductAndUser = Prisma.OrderGetPayload<{
    include: { cart: { include: { products: true; user: true } } };
}>;
