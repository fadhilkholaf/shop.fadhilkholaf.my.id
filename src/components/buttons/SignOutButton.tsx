"use client";

import Form from "next/form";
import { usePathname } from "next/navigation";

import { signOutAction } from "@/actions/auth";
import { useCartModal } from "@/components/context/CartModalContext";

export default function SignOutButton() {
    const pathname = usePathname();

    const { setCartData } = useCartModal();

    return (
        <Form
            action={async function () {
                setCartData(null);

                await signOutAction(pathname);
            }}
        >
            <button type="submit" className="text-nowrap">
                Sign Out
            </button>
        </Form>
    );
}
