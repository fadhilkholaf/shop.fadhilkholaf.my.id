"use client";

import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "motion/react";

import { signInAction } from "@/actions/auth";
import { useSignInModal } from "@/context/SignInModalContext";
import { cn } from "@/utils/cn";
import { authModalFormVariants, modalVariants } from "@/utils/motion-variants";

import GitHubLogo from "@/public/images/logo/GitHub_Lockup_Light.svg";

export default function NewSignInModal() {
    const pathname = usePathname();

    const signInModalRef = useRef<HTMLDivElement>(null);

    const [error, setError] = useState<string>("");

    const { isOpen, setIsOpen } = useSignInModal();

    useEffect(
        function () {
            const signInModalElement = signInModalRef.current;

            function handleClick(e: MouseEvent) {
                const target = e.target as Node;

                if (
                    isOpen &&
                    signInModalElement &&
                    !signInModalElement.contains(target)
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
                                    "flex items-end justify-center md:items-center",
                                    "backdrop-brightness-50",
                                    "ease-out-expo transition-[height] duration-200",
                                )}
                            >
                                <motion.div
                                    ref={signInModalRef}
                                    variants={authModalFormVariants}
                                    className={cn(
                                        "auth-modal",
                                        "w-full overflow-hidden md:w-2/3",
                                        "md:flex",
                                        "rounded-t-lg md:rounded-lg",
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-full p-8",
                                            "flex flex-col justify-between gap-y-8",
                                            "bg-secondary text-primary",
                                        )}
                                    >
                                        <header>
                                            <h3 className="font-mono">Shop.</h3>
                                        </header>
                                    </div>
                                    <Form
                                        action={async function (formData) {
                                            const response = await signInAction(
                                                formData,
                                                pathname,
                                            );

                                            if (response && response.error) {
                                                setError(response.error);
                                            }
                                        }}
                                        className={cn(
                                            "w-full p-8",
                                            "flex flex-col justify-between gap-y-8",
                                            "bg-primary text-secondary",
                                        )}
                                    >
                                        <header>
                                            <h3>Sign In</h3>
                                        </header>
                                        <main>
                                            <button
                                                type="submit"
                                                className={cn(
                                                    "w-full",
                                                    "flex justify-center px-4 py-2",
                                                    "bg-github rounded-sm",
                                                )}
                                            >
                                                <Image
                                                    src={GitHubLogo}
                                                    alt="Sign in with GitHub"
                                                    unoptimized
                                                    priority
                                                    className="h-4"
                                                />
                                            </button>
                                        </main>
                                        <footer className="flex flex-col gap-y-4">
                                            <div>
                                                <p className="text-error">
                                                    {error}
                                                </p>
                                            </div>
                                            <Terms
                                                closeModal={function () {
                                                    setIsOpen(false);
                                                }}
                                            />
                                        </footer>
                                    </Form>
                                </motion.div>
                            </motion.section>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </>
    );
}

function Terms({ closeModal }: { closeModal: () => void }) {
    return (
        <>
            <div className="flex items-center gap-x-4">
                <input
                    type="checkbox"
                    name="privacy-policy"
                    id="privacy-policy"
                />
                <label htmlFor="privacy-policy">
                    {`I have read and agree with `}
                    <Link
                        href="/privacy-policy"
                        className="font-semibold"
                        onClick={closeModal}
                    >
                        privacy policy.
                    </Link>
                </label>
            </div>
            <div className="flex items-center gap-x-4">
                <input
                    type="checkbox"
                    name="terms-and-conditions"
                    id="terms-and-conditions"
                />
                <label htmlFor="terms-and-conditions">
                    {`I have read and agree with `}
                    <Link
                        href="/terms-and-conditions"
                        className="font-semibold"
                        onClick={closeModal}
                    >
                        terms and conditions.
                    </Link>
                </label>
            </div>
        </>
    );
}
