import Link from "next/link";

import { cn } from "@/utils/cn";

const links: { href: string; title: string }[][] = [
    [
        { href: "/", title: "Home" },
        { href: "/products", title: "Products" },
    ],
    [
        { href: "/privacy-policy", title: "Privacy Policy" },
        { href: "/terms-and-conditions", title: "Terms and Conditions" },
    ],
    [
        { href: "https://instagram.com/shop.fadhilkholaf", title: "Instagram" },
        { href: "https://github.com/fadhilkholaf", title: "GitHub" },
    ],
];

export default function Footer() {
    return (
        <footer className={cn("layout", "my-16", "flex flex-col gap-y-8")}>
            <header>
                <h4>shop.</h4>
                <p>The code.</p>
            </header>
            <main className="w-full">
                <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
                    {links.map(function (link, i) {
                        return (
                            <ul key={i} className="flex flex-col">
                                {link.map(function (item, j) {
                                    return (
                                        <li key={j}>
                                            {item.href.startsWith("/") ? (
                                                <Link href={item.href}>
                                                    {item.title}
                                                </Link>
                                            ) : (
                                                <a href={item.href}>
                                                    {item.title}
                                                </a>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        );
                    })}
                </ul>
            </main>
        </footer>
    );
}
