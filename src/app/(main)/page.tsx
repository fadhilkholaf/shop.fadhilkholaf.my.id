"use client";

import { motion, Variants } from "motion/react";
import { Fragment } from "react";

const headingWrapper: Variants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.025 } },
};

const headingWord: Variants = {
    initial: { y: "100%" },
    animate: {
        y: 0,
        transition: { duration: 0.75, type: "tween", ease: [0.16, 1, 0.3, 1] },
    },
};

export default function MainPage() {
    return (
        <main className="layout mt-32 h-[150vh]">
            <div className="flex flex-col items-center gap-y-4">
                <motion.h1
                    className="inline-block w-full text-center md:w-2/3"
                    variants={headingWrapper}
                    initial="initial"
                    animate="animate"
                >
                    {"ACCESS-🔓 TO MY PRIVATE REPO-📁"
                        .split(" ")
                        .map(function (word, i) {
                            return (
                                <Fragment key={i}>
                                    <span className="inline-block overflow-hidden">
                                        <motion.span
                                            variants={headingWord}
                                            className="inline-block"
                                        >
                                            {word.replaceAll("-", " ")}
                                        </motion.span>
                                    </span>
                                    <span> </span>
                                </Fragment>
                            );
                        })}
                </motion.h1>
                <p>{`I'm not gatekeeping bro, I only sell my work 💔 🥀`}</p>
            </div>
        </main>
    );
}
