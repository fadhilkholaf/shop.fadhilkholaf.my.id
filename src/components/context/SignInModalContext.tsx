"use client";

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";

import SignInModal from "@/components/modal/SignInModal";

const SignInModalContext = createContext<
    | {
          isOpen: boolean;
          setIsOpen: Dispatch<SetStateAction<boolean>>;
      }
    | undefined
>(undefined);

export default function SignInModalProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(
        function () {
            if (isOpen) {
                document.body.setAttribute("data-lenis-prevent", "true");
            } else {
                document.body.removeAttribute("data-lenis-prevent");
            }

            return function () {
                document.body.removeAttribute("data-lenis-prevent");
            };
        },
        [isOpen],
    );

    return (
        <SignInModalContext.Provider value={{ isOpen, setIsOpen }}>
            <SignInModal />
            {children}
        </SignInModalContext.Provider>
    );
}

export function useSignInModal() {
    const context = useContext(SignInModalContext);

    if (!context) {
        throw new Error(
            "useSignInModal must be used within an SignInModalProvider!",
        );
    }

    return context;
}
