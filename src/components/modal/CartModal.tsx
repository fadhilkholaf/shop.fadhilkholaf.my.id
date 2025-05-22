"use client";

import Form from "next/form";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "motion/react";

import { removeCartItemAction } from "@/actions/cart";
import CheckOutButton from "@/components/buttons/CheckOutButton";
import { useCartModal } from "@/context/CartModalContext";
import { Prisma } from "@/prisma/generated";
import { cn } from "@/utils/cn";
import { modalVariants } from "@/utils/motion-variants";

export default function CartModal() {
    const { isOpen, setIsOpen, cartData, setCartData } = useCartModal();

    const cartModalRef = useRef<HTMLDivElement>(null);

    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(function () {
        setIsMounted(true);
    }, []);

    useEffect(
        function () {
            const cartModalElement = cartModalRef.current;

            function handleClick(e: MouseEvent) {
                const target = e.target as Node;

                if (
                    isOpen &&
                    cartModalElement &&
                    !cartModalElement.contains(target)
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
            {isMounted &&
                createPortal(
                    <AnimatePresence mode="wait">
                        {isOpen && (
                            <motion.section
                                initial="initial"
                                animate="animate"
                                exit="initial"
                                variants={modalVariants}
                                className={cn(
                                    "size-full",
                                    "fixed top-0 left-0 z-50",
                                    "flex items-end justify-end",
                                    "backdrop-brightness-50",
                                )}
                            >
                                <motion.div
                                    ref={cartModalRef}
                                    variants={{
                                        initial: {
                                            x: "var(--x-initial)",
                                            y: "var(--y-initial)",
                                            transition: {
                                                type: "tween",
                                                duration: 0.5,
                                                ease: [0.16, 1, 0.3, 1],
                                            },
                                        },
                                        animate: {
                                            x: "var(--x-animate)",
                                            y: "var(--y-animate)",
                                            transition: {
                                                type: "tween",
                                                duration: 0.5,
                                                ease: [0.16, 1, 0.3, 1],
                                            },
                                        },
                                    }}
                                    className={cn(
                                        "cart-modal",
                                        "h-3/4 w-full p-8 md:h-full md:w-1/2",
                                        "flex flex-col justify-between gap-y-8",
                                        "bg-primary text-secondary overflow-y-auto rounded-t-lg md:rounded-t-none md:rounded-l-lg",
                                    )}
                                >
                                    <header className="flex items-center justify-between">
                                        <h6 className="font-mono">Cart.</h6>
                                        <button
                                            type="button"
                                            onClick={function () {
                                                setIsOpen(false);
                                            }}
                                        >
                                            Close
                                        </button>
                                    </header>
                                    <main className="h-full overflow-y-auto pr-4">
                                        <ul>
                                            {cartData &&
                                                cartData.products.map(
                                                    function (product, i) {
                                                        return (
                                                            <li
                                                                key={i}
                                                                className="h-[50vh]"
                                                            >
                                                                <Image
                                                                    src={
                                                                        product.image
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    width={1024}
                                                                    height={
                                                                        1024
                                                                    }
                                                                    priority
                                                                    className="aspect-video h-32 w-fit rounded-lg object-cover"
                                                                />
                                                                <h1>
                                                                    {
                                                                        product.name
                                                                    }
                                                                </h1>
                                                                <Form
                                                                    action={async function () {
                                                                        const response =
                                                                            await removeCartItemAction(
                                                                                cartData.id,
                                                                                product.id,
                                                                            );

                                                                        if (
                                                                            !response.success
                                                                        ) {
                                                                            return;
                                                                        }

                                                                        setCartData(
                                                                            response.data as Prisma.CartGetPayload<{
                                                                                include: {
                                                                                    products: true;
                                                                                };
                                                                            }>,
                                                                        );
                                                                    }}
                                                                >
                                                                    <button type="submit">
                                                                        Remove
                                                                    </button>
                                                                </Form>
                                                            </li>
                                                        );
                                                    },
                                                )}
                                        </ul>
                                    </main>
                                    <footer>
                                        {cartData &&
                                            !!cartData.products.length && (
                                                <CheckOutButton
                                                    cart={cartData}
                                                />
                                            )}
                                    </footer>
                                </motion.div>
                            </motion.section>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </>
    );
}
