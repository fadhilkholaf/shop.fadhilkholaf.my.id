import Link from "next/link";

import { auth } from "@/lib/auth";

import CartButton from "@/components/buttons/CartModalButton";
import SignInButton from "@/components/buttons/SignInModalButton";
import SignOutButton from "@/components/buttons/SignOutButton";
import AdminMenuModal from "@/components/modal/AdminMenuModal";
import { cn } from "@/utils/cn";

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
                        <h4>shop.</h4>
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
                        {!session && (
                            <li>
                                <SignInButton>
                                    <p className="text-nowrap">Sign In</p>
                                </SignInButton>
                            </li>
                        )}
                        {session && session.user.role === "admin" && (
                            <li>
                                <AdminMenuModal />
                            </li>
                        )}
                        {session && (
                            <li>
                                <SignOutButton />
                            </li>
                        )}
                    </ul>
                </footer>
            </nav>
        </header>
    );
}
