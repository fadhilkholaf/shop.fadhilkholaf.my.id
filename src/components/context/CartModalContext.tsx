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

import CartModal from "@/components/modal/CartModal";
import { Prisma } from "@/prisma/generated";
import { CartWithProduct } from "@/types/prisma-relations";

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
}: {
    children: ReactNode;
    cart: CartWithProduct | null;
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [cartData, setCartData] = useState<Prisma.CartGetPayload<{
        include: { products: true };
    }> | null>(cart);

    useEffect(
        function () {
            if (isOpen) {
                document.body.setAttribute("data-lenis-prevent", "true");
            } else {
                document.body.removeAttribute("data-lenis-prevent");
            }

            return function () {
                document.body.removeAttribute("data-lenis-prevent");
            };
        },
        [isOpen],
    );

    return (
        <CartModalContext.Provider
            value={{ isOpen, setIsOpen, cartData, setCartData }}
        >
            <CartModal />
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
