"use client";

import { ReactNode, useEffect, useRef } from "react";

import { LenisRef, ReactLenis } from "lenis/react";
import { cancelFrame, frame } from "motion";

import { useCartModal } from "@/context/CartModalContext";

export default function LenisWrapper({ children }: { children: ReactNode }) {
    const lenisRef = useRef<LenisRef>(null);

    const { isOpen } = useCartModal();

    useEffect(function () {
        function update(data: { timestamp: number }) {
            const time = data.timestamp;
            lenisRef.current?.lenis?.raf(time);
        }

        frame.update(update, true);

        return function () {
            cancelFrame(update);
        };
    }, []);

    return (
        <ReactLenis root={!isOpen} options={{ autoRaf: false }} ref={lenisRef}>
            {children}
        </ReactLenis>
    );
}
