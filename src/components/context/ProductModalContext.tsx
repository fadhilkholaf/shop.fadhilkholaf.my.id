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

import { Product } from "@/prisma/generated";
import ProductModal from "@/components/modal/ProductModal";

const ProductModalContext = createContext<
    | {
          isOpen: boolean;
          setIsOpen: Dispatch<SetStateAction<boolean>>;
          product: Product | null;
          setProduct: Dispatch<SetStateAction<Product | null>>;
      }
    | undefined
>(undefined);

export default function ProductModalProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(
        function () {
            if (isOpen) {
                document.body.setAttribute("data-lenis-prevent", "true");
            } else {
                setProduct(null);
                document.body.removeAttribute("data-lenis-prevent");
            }

            return function () {
                document.body.removeAttribute("data-lenis-prevent");
            };
        },
        [isOpen],
    );

    return (
        <ProductModalContext.Provider
            value={{ isOpen, setIsOpen, product, setProduct }}
        >
            <ProductModal />
            {children}
        </ProductModalContext.Provider>
    );
}

export function useProductModal() {
    const context = useContext(ProductModalContext);

    if (!context) {
        throw new Error(
            "useProductModal must be used within an ProductModalProvider!",
        );
    }

    return context;
}
