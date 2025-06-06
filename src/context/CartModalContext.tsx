"use client";

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react";

import { Prisma } from "@/prisma/generated";
import CartModal from "@/components/modal/CartModal";
import { CartWithProduct } from "@/types/prisma-relations";
import { Session } from "next-auth";

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
    cart,
    session,
}: {
    children: ReactNode;
    cart: CartWithProduct | null;
    session: Session | null;
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [cartData, setCartData] = useState<Prisma.CartGetPayload<{
        include: { products: true };
    }> | null>(cart);

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
