import Link from "next/link";

import { auth } from "@/lib/auth";

import CartButton from "@/components/buttons/CartButton";
import SignOutButton from "@/components/buttons/SignOutButton";

import AuthModalButton from "./parts/auth/AuthModalButton";
import { cn } from "@/utils/cn";
import AdminMenuModal from "../modal/AdminMenuModal";

const items = [{ title: "Products", href: "/products" }];

export default async function Navbar() {
    const session = await auth();

    return (
        <header
            id="rootHeader"
            className={cn(
                "fixed",
                "w-full",
                "top-0",
                "bg-primary text-secondary",
            )}
        >
            <nav className={cn("layout", "py-2", "flex gap-x-8 md:gap-x-16")}>
                <header>
                    <Link href="/">
                        <h6>Shop.</h6>
                    </Link>
                </header>
                <main className="w-full">
                    <ul className="flex size-full items-center gap-x-4 font-semibold">
                        {items.map(function (item, i) {
                            return (
                                <li key={i}>
                                    <Link href={item.href}>{item.title}</Link>
                                </li>
                            );
                        })}
                        {session && <CartButton>Cart</CartButton>}
                    </ul>
                </main>
                <footer>
                    <ul className="flex size-full items-center gap-x-4 font-semibold">
                        {!session && <AuthModalButton />}
                        {session && session.user.role === "admin" && (
                            <li>
                                <AdminMenuModal />
                            </li>
                        )}
                        {session && <SignOutButton />}
                    </ul>
                </footer>
            </nav>
        </header>
    );
}
