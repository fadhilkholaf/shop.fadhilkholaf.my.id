"use client";

import { ReactNode } from "react";

import { useSignInModal } from "@/context/SignInModalContext";

export default function SignInButton({ children }: { children: ReactNode }) {
    const { setIsOpen } = useSignInModal();

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
