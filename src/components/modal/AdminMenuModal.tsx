"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, motion, Variants } from "motion/react";

import { cn } from "@/utils/cn";
import { modalVariants } from "@/utils/motion-variants";

const menu: { href: string; title: string }[] = [
    { href: "/admin", title: "Dashboard" },
    { href: "/admin/products", title: "Products" },
];

const variants: Variants = {
    initial: {
        y: "var(--y-initial)",
        rotateZ: "var(--rz-initial)",
        transition: {
            type: "tween",
            duration: 0.5,
            ease: [0.65, 0, 0.35, 1],
        },
    },
    animate: {
        y: "var(--y-animate)",
        rotateZ: "var(--rz-animate)",
        transition: {
            type: "tween",
            duration: 0.5,
            ease: [0.65, 0, 0.35, 1],
        },
    },
};

export default function AdminMenuModal() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const adminMenuModalRef = useRef<HTMLDivElement>(null);
    const adminMenuModalButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(function () {
        const root = document.documentElement;
        const rootHeader = document.getElementById("rootHeader")!;

        function setHeaderHeightVariable() {
            root.style.setProperty(
                "--root-header-height",
                `${rootHeader.clientHeight}px`,
            );
        }

        setHeaderHeightVariable();

        window.addEventListener("resize", setHeaderHeightVariable);

        return function () {
            window.removeEventListener("resize", setHeaderHeightVariable);
        };
    }, []);

    useEffect(
        function () {
            const adminMenuModalElement = adminMenuModalRef.current;
            const adminMenuModalButtonElement = adminMenuModalButtonRef.current;

            function handleClick(e: MouseEvent) {
                const target = e.target as Node;

                if (
                    isOpen &&
                    adminMenuModalButtonElement &&
                    !adminMenuModalButtonElement.contains(target) &&
                    adminMenuModalElement &&
                    !adminMenuModalElement.contains(target)
                ) {
                    setIsOpen(false);
                }
            }

            window.addEventListener("click", handleClick, { capture: true });

            return function () {
                window.removeEventListener("click", handleClick, {
                    capture: true,
                });
            };
        },
        [isOpen, setIsOpen],
    );

    return (
        <>
            <button
                type="button"
                ref={adminMenuModalButtonRef}
                onClick={function () {
                    setIsOpen(function (prev) {
                        return !prev;
                    });
                }}
            >
                Admin
            </button>
            {typeof window !== "undefined" &&
                createPortal(
                    <AnimatePresence mode="wait">
                        {isOpen && (
                            <motion.section
                                initial="initial"
                                animate="animate"
                                exit="initial"
                                variants={modalVariants}
                                className={cn(
                                    "layout",
                                    "fixed top-0 left-1/2 z-50 -translate-x-1/2 translate-y-[calc(var(--root-header-height))]",
                                    "flex justify-end",
                                    "pointer-events-none",
                                )}
                            >
                                <motion.article
                                    ref={adminMenuModalRef}
                                    variants={variants}
                                    className={cn(
                                        "admin-menu-modal",
                                        "h-fit w-full p-4 md:w-[200px]",
                                        "flex flex-col justify-between gap-y-4",
                                        "bg-secondary text-primary pointer-events-auto origin-left rounded-lg",
                                    )}
                                >
                                    <ul className="flex flex-col gap-y-4 font-semibold">
                                        {menu.map(function (m, i) {
                                            return (
                                                <li key={i}>
                                                    <Link
                                                        href={m.href}
                                                        onClick={function () {
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        {m.title}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </motion.article>
                            </motion.section>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </>
    );
}
