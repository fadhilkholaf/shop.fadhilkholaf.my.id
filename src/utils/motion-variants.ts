import { Variants } from "motion/react";

export const modalVariants: Variants = {
    initial: {
        opacity: 0,
        transition: { type: "tween", duration: 0.5, ease: "linear" },
    },
    animate: {
        opacity: 1,
        transition: { type: "tween", duration: 0.5, ease: "linear" },
    },
};

export const authModalFormVariants: Variants = {
    initial: {
        y: "var(--y-initial)",
        transition: {
            type: "tween",
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    animate: {
        y: "var(--y-animate)",
        transition: {
            type: "tween",
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};
export const cartModalVariants: Variants = {
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
};
