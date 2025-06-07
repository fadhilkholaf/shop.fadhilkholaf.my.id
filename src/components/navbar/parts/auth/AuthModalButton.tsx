"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import SignInModal from "@/components/modal/SignInModal";
import SignUpModal from "@/components/modal/SignUpModal";

export default function ModalButton() {
    const signUpModalRef = useRef<HTMLDivElement>(null);
    const signInModalRef = useRef<HTMLDivElement>(null);

    const [signUp, setSignUp] = useState<boolean>(false);
    const [signIn, setSignIn] = useState<boolean>(false);

    useEffect(
        function () {
            const signInModalElement = signInModalRef.current;
            const signUpModalElement = signUpModalRef.current;

            function handleClick(e: MouseEvent) {
                const target = e.target as Node;

                if (
                    signIn &&
                    signInModalElement &&
                    !signInModalElement.contains(target)
                ) {
                    setSignIn(false);
                }

                if (
                    signUp &&
                    signUpModalElement &&
                    !signUpModalElement.contains(target)
                ) {
                    setSignUp(false);
                }
            }

            if (signIn || signUp) {
                window.addEventListener("click", handleClick, {
                    capture: true,
                });
            }

            return function () {
                window.removeEventListener("click", handleClick, {
                    capture: true,
                });
            };
        },
        [signIn, signUp],
    );

    return (
        <>
            <li>
                <button
                    type="button"
                    className="text-nowrap"
                    onClick={function () {
                        setSignIn(true);
                    }}
                >
                    Sign In
                </button>
            </li>
            <li>
                <button
                    type="button"
                    className="text-nowrap"
                    onClick={function () {
                        setSignUp(true);
                    }}
                >
                    Sign Up
                </button>
            </li>
            {typeof window !== "undefined" &&
                createPortal(
                    <>
                        <SignUpModal
                            signUpModalRef={signUpModalRef}
                            isOpen={signUp}
                            closeModal={function () {
                                setSignUp(false);
                            }}
                            swicthModal={function () {
                                setSignUp(false);
                                setSignIn(true);
                            }}
                        />
                        <SignInModal
                            signInModalRef={signInModalRef}
                            isOpen={signIn}
                            closeModal={function () {
                                setSignIn(false);
                            }}
                            swicthModal={function () {
                                setSignIn(false);
                                setSignUp(true);
                            }}
                        />
                    </>,
                    document.body,
                )}
        </>
    );
}
