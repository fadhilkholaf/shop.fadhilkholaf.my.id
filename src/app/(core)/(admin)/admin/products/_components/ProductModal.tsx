"use client";

import Form from "next/form";
import { useEffect, useRef, useState } from "react";

import { createProductAction } from "@/actions/product";
import { getGithubRepositoryById } from "@/actions/github";

export default function ProductModal() {
    const formRef = useRef<HTMLFormElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [isOpen, setIsOpen] = useState<boolean>(true);

    useEffect(
        function () {
            function handleClick(e: MouseEvent) {
                if (
                    formRef.current?.contains(e.target as Node) ||
                    buttonRef.current?.contains(e.target as Node)
                ) {
                    return;
                }

                setIsOpen(false);
            }

            if (isOpen) {
                window.document.body.classList.add("overflow-hidden");
            } else {
                window.document.body.classList.remove("overflow-hidden");
            }

            window.addEventListener("click", handleClick);

            return function () {
                window.removeEventListener("click", handleClick);
            };
        },
        [isOpen],
    );

    return (
        <>
            {isOpen && (
                <main className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-pink-500">
                    <Form
                        ref={formRef}
                        action={async function (formData) {
                            const image = formData.get("image") as File;

                            if (image.size >= 1 * 1024 * 1024) {
                                alert("File too large!");
                                return;
                            }

                            const response =
                                await createProductAction(formData);

                            console.log(response);
                        }}
                        className="h-fit w-fit rounded-lg bg-white p-4"
                    >
                        <header>
                            <h1>Create Order</h1>
                        </header>
                        <main>
                            <div>
                                <label htmlFor="repo">Repository Name</label>
                                <input type="text" name="repo" id="repo" />
                            </div>
                            <div>
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name" id="name" />
                            </div>
                            <div>
                                <label htmlFor="price">Price</label>
                                <input type="number" name="price" id="price" />
                            </div>
                            <div>
                                <label htmlFor="image">Image</label>
                                <input type="file" name="image" id="image" />
                            </div>
                        </main>
                        <footer>
                            <button type="submit">Create Order</button>
                        </footer>
                    </Form>
                </main>
            )}
            <button
                ref={buttonRef}
                type="button"
                onClick={function () {
                    setIsOpen(function (prev) {
                        return !prev;
                    });
                }}
                className="fixed top-0 right-0"
            >
                CreateProduct
            </button>
        </>
    );
}
