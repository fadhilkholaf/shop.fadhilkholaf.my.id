"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";

import { useSignInModal } from "@/context/SignInModalContext";

export default function SignInButton({
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
