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

const ProductModalContext = createContext<
    | {
          isOpen: boolean;
          setIsOpen: Dispatch<SetStateAction<boolean>>;
      }
    | undefined
>(undefined);

export default function ProductModalProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

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
        <ProductModalContext.Provider value={{ isOpen, setIsOpen }}>
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
