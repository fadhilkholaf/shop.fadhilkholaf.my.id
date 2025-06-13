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

    if (!session) {
        return <CartModalProvider cart={null}>{children}</CartModalProvider>;
    }

    const carts: CartWithProduct[] = (await getAllCart(
        { user: { githubId: session.user.githubId }, order: null },
        { products: true },
    )) as CartWithProduct[];

    return <CartModalProvider cart={carts[0]}>{children}</CartModalProvider>;
}
