"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";

import { useCartModal } from "@/context/CartModalContext";

export default function CartButton({
    children,
    ...props
}: {
    children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "type" | "onClick">) {
    const { setIsOpen } = useCartModal();

    return (
        <button
            type="button"
            onClick={function () {
                setIsOpen(true);
            }}
            {...props}
        >
            {children}
        </button>
    );
}
