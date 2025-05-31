"use client";

import Form from "next/form";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { RefObject, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { signInAction } from "@/actions/auth";
import { cn } from "@/utils/cn";
import { authModalFormVariants, modalVariants } from "@/utils/motion-variants";

import GitHubLogo from "@/public/images/logo/GitHub_Lockup_Light.svg";

import Terms from "@/components/misc/Terms";

export default function SignUpModal({
    signUpModalRef,
    isOpen,
    closeModal,
    swicthModal,
}: {
    signUpModalRef: RefObject<HTMLDivElement | null>;
    isOpen: boolean;
    closeModal: () => void;
    swicthModal: () => void;
}) {
    const pathname = usePathname();

    const [error, setError] = useState<string>("");

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.section
                    initial="initial"
                    animate="animate"
                    exit="initial"
                    variants={modalVariants}
                    className={cn(
                        "h-svh w-screen",
                        "fixed top-0 left-0 z-50",
                        "flex items-end justify-center md:items-center",
                        "backdrop-brightness-50",
                    )}
                >
                    <motion.div
                        ref={signUpModalRef}
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
                            <footer>
                                <p>
                                    {`Have an account? `}
                                    <button
                                        type="button"
                                        className="font-semibold"
                                        onClick={swicthModal}
                                    >
                                        Sign In
                                    </button>
                                </p>
                            </footer>
                        </div>
                        <Form
                            action={async function (formData) {
                                const response = await signInAction(
                                    formData,
                                    pathname,
                                );

                                if (response && !response.error) {
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
                                <h3>Sign Up</h3>
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
                                        alt="Sign up with GitHub"
                                        unoptimized
                                        priority
                                        className="h-4"
                                    />
                                </button>
                            </main>
                            <footer className="flex flex-col gap-y-4">
                                <div>
                                    <p className="text-error">{error}</p>
                                </div>
                                <Terms closeModal={closeModal} />
                            </footer>
                        </Form>
                    </motion.div>
                </motion.section>
            )}
        </AnimatePresence>
    );
}
