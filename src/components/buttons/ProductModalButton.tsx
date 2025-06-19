"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";

import { useProductModal } from "@/components/context/ProductModalContext";

export default function ProductModalButton({
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
