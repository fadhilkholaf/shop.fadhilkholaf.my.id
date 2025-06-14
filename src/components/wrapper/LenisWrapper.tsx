"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { type LenisRef, ReactLenis } from "lenis/react";
import { type FrameData, cancelFrame, frame } from "motion";

export default function LenisWrapper({ children }: { children: ReactNode }) {
    const lenisRef = useRef<LenisRef>(null);

    useEffect(function () {
        function update(data: FrameData) {
            lenisRef.current?.lenis?.raf(data.timestamp);
        }

        frame.update(update, true);

        const observer = new MutationObserver(function () {
            document.documentElement.classList.toggle(
                "overflow-hidden",
                document.body.dataset.lenisPrevent === "true",
            );
        });

        observer.observe(document.body, {
            // attributes: true,
            attributeFilter: ["data-lenis-prevent"],
        });

        return function () {
            cancelFrame(update);
            observer.disconnect();
        };
    }, []);

    return (
        <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
            {children}
        </ReactLenis>
    );
}
