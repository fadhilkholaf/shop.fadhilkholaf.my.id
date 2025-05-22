import Link from "next/link";

import { auth } from "@/lib/auth";

import CartButton from "@/components/buttons/CartButton";
import SignOutButton from "@/components/buttons/SignOutButton";

import AuthModalButton from "./parts/auth/AuthModalButton";

const items = [{ title: "Products", href: "/products" }];

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="layout bg-secondary text-primary fixed top-0 left-1/2 z-40 flex -translate-x-1/2 gap-x-8 rounded-b-lg px-4 py-2 md:gap-x-16">
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
                            <Link href="/admin">Admin</Link>
                        </li>
                    )}
                    {session && <SignOutButton />}
                </ul>
            </footer>
        </nav>
    );
}
