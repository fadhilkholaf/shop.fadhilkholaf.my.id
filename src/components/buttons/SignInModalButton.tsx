"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";

import { useSignInModal } from "@/components/context/SignInModalContext";

export default function SignInModalButton({
    children,
    ...props
}: {
    children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "type" | "onClick">) {
    const { setIsOpen } = useSignInModal();

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
