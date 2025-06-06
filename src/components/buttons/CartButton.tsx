"use client";

import { ReactNode } from "react";

import { useCartModal } from "@/context/CartModalContext";

export default function CartButton({ children }: { children: ReactNode }) {
    const { setIsOpen } = useCartModal();

    return (
        <button
            type="button"
            onClick={function () {
                setIsOpen(true);
            }}
        >
            {children}
        </button>
    );
}
