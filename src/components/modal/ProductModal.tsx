"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "motion/react";

import { useProductModal } from "@/components/context/ProductModalContext";
import ProductForm from "@/components/ProductForm";
import { cn } from "@/utils/cn";
import { cartModalVariants, modalVariants } from "@/utils/motion-variants";

export default function ProductModal() {
    const { isOpen, setIsOpen, product } = useProductModal();

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(
        function () {
            const modalElement = modalRef.current;

            function handleClick(e: MouseEvent) {
                const target = e.target as Node;

                if (isOpen && modalElement && !modalElement.contains(target)) {
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
                                    "h-dvh w-screen",
                                    "fixed top-0 left-0 z-50",
                                    "flex items-end justify-end",
                                    "backdrop-brightness-50",
                                )}
                            >
                                <motion.div
                                    ref={modalRef}
                                    variants={cartModalVariants}
                                    className={cn(
                                        "cart-modal",
                                        "h-3/4 w-full p-8 md:h-full md:w-3/4",
                                        "bg-primary text-secondary rounded-t-lg md:rounded-t-none md:rounded-l-lg",
                                    )}
                                >
                                    <ProductForm
                                        product={product}
                                        closeModal={function () {
                                            setIsOpen(false);
                                        }}
                                    />
                                </motion.div>
                            </motion.section>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </>
    );
}
