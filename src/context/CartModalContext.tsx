"use client";

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";

import { useSession } from "next-auth/react";

import { Prisma } from "@/prisma/generated";
import { getAllCart } from "@/query/cart";
import CartModal from "@/components/modal/CartModal";

const CartModalContext = createContext<
    | {
          isOpen: boolean;
          setIsOpen: Dispatch<SetStateAction<boolean>>;
          cartData: Prisma.CartGetPayload<{
              include: { products: true };
          }> | null;
          setCartData: Dispatch<
              SetStateAction<Prisma.CartGetPayload<{
                  include: { products: true };
              }> | null>
          >;
      }
    | undefined
>(undefined);

export default function CartModalProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [cartData, setCartData] = useState<Prisma.CartGetPayload<{
        include: { products: true };
    }> | null>(null);

    const { data: session } = useSession();

    useEffect(
        function () {
            async function handleSetCartData() {
                if (!session) {
                    return;
                }

                const carts = (await getAllCart(
                    { user: { githubId: session.user.githubId }, order: null },
                    { products: true },
                )) as Prisma.CartGetPayload<{ include: { products: true } }>[];

                setCartData(carts[0]);
            }

            handleSetCartData();
        },
        [session],
    );

    return (
        <CartModalContext.Provider
            value={{ isOpen, setIsOpen, cartData, setCartData }}
        >
            {session && <CartModal />}
            {children}
        </CartModalContext.Provider>
    );
}

export function useCartModal() {
    const context = useContext(CartModalContext);

    if (!context) {
        throw new Error(
            "useCartModal must be used within an CartModalProvider!",
        );
    }

    return context;
}
