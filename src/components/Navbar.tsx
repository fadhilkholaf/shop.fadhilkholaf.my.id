import { revalidatePath } from "next/cache";
import Form from "next/form";

import { Session } from "next-auth";

import { auth, signIn, signOut } from "@/lib/auth";
import Link from "next/link";

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="fixed top-0 left-0">
            <ul className="flex gap-2">
                <li>
                    <Link href="/" className="font-mono">
                        server
                    </Link>
                </li>
                <li>
                    <Link href="/client">client</Link>
                </li>
                <li>
                    <Link href="/paypal">paypal</Link>
                </li>
                <li>
                    <Link href="/products">Products</Link>
                </li>
                <li>
                    <Link href="/cart">Cart</Link>
                </li>
                <li>
                    <Link href="/order">Order</Link>
                </li>
                <li>
                    <Link href="/admin">Admin</Link>
                </li>
                <li>
                    <Link href="/admin/products">Admin Products</Link>
                </li>
                <Authenticated session={session} />
            </ul>
        </nav>
    );
}

function Authenticated({ session }: { session: Session | null }) {
    if (!session) {
        return (
            <li>
                <Form
                    action={async function () {
                        "use server";

                        await signIn("github", { redirect: true });

                        revalidatePath("/", "layout");
                    }}
                >
                    <button type="submit">Sign In</button>
                </Form>
            </li>
        );
    }

    return (
        <li>
            <Form
                action={async function () {
                    "use server";

                    await signOut({ redirect: true });

                    revalidatePath("/", "layout");
                }}
            >
                <button type="submit">Sign Out</button>
            </Form>
        </li>
    );
}
