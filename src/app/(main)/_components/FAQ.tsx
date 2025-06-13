"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/utils/cn";

const qnas: { q: string; a: string }[] = [
    {
        q: "How this thing work?",
        a: "Login, add to cart, checkout, request invitations.",
    },
    {
        q: "Payment",
        a: "Accept PayPal or credit card.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="flex flex-col gap-y-8 md:gap-y-16">
            <header className="flex flex-col items-center">
                <h1 className="text-center text-4xl md:text-6xl xl:text-8xl">
                    FAQ 🙋🏿‍♂️
                </h1>
                <p>{`Is it simple? 🤔`}</p>
            </header>
            <main>
                <ul className="flex flex-col gap-y-8">
                    {qnas.map(function (qna, i) {
                        const isOpen = openIndex === i;

                        return (
                            <li key={i}>
                                <article>
                                    <header>
                                        <button
                                            type="button"
                                            onClick={function () {
                                                setOpenIndex(isOpen ? null : i);
                                            }}
                                            className="w-full"
                                        >
                                            <h1 className="flex justify-between">
                                                <span>{qna.q}</span>
                                                <span
                                                    className={cn(
                                                        "ease-out-expo rotate-90 transition-[rotate] duration-500",
                                                        {
                                                            "-rotate-90":
                                                                isOpen,
                                                        },
                                                    )}
                                                >
                                                    👉🏿
                                                </span>
                                            </h1>
                                        </button>
                                    </header>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.main
                                                initial="initial"
                                                animate="animate"
                                                exit="initial"
                                                variants={{
                                                    initial: {
                                                        height: 0,
                                                        opacity: 0,
                                                    },
                                                    animate: {
                                                        height: "auto",
                                                        opacity: 1,
                                                    },
                                                }}
                                            >
                                                <p>{qna.a}</p>
                                            </motion.main>
                                        )}
                                    </AnimatePresence>
                                </article>
                            </li>
                        );
                    })}
                </ul>
            </main>
        </section>
    );
}
