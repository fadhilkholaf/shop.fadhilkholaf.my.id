"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";

import { useProductModal } from "@/context/ProductModalContext";

export default function ProductButton({
    children,
    ...props
}: {
    children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "type" | "onClick">) {
    const { setIsOpen } = useProductModal();

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
