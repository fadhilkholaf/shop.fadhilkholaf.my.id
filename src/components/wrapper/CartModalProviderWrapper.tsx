import { ReactNode } from "react";

import CartModalProvider from "@/context/CartModalContext";
import { auth } from "@/lib/auth";
import { getAllCart } from "@/query/cart";
import { CartWithProduct } from "@/types/prisma-relations";

export default async function CartModalProviderWrapper({
    children,
}: {
    children: ReactNode;
}) {
    const session = await auth();

    let carts: CartWithProduct[] = [];

    if (session) {
        carts = (await getAllCart(
            { user: { githubId: session.user.githubId }, order: null },
            { products: true },
        )) as CartWithProduct[];
    }

    return (
        <CartModalProvider cart={carts[0]} session={session}>
            {children}
        </CartModalProvider>
    );
}
