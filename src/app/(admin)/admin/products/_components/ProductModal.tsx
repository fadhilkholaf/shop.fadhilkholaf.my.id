"use client";

import Form from "next/form";
import { useActionState, useEffect, useRef, useState } from "react";

import { typeToFlattenedError } from "zod";

import { createProductAction } from "@/actions/product";
import { CreateProductSchema } from "@/schema/product";

type ActionState = {
    data: FormData | null;
    error: typeToFlattenedError<CreateProductSchema, string> | null;
};

async function handleCreateProduct(prevState: ActionState, formData: FormData) {
    const image = formData.get("image") as File;

    if (image.size >= 1 * 1024 * 1024) {
        alert("File too large!");
        return { data: formData, error: null };
    }

    const response = await createProductAction(formData);

    if (!response.success) {
        return {
            data: formData,
            error: response.data as ActionState["error"],
        };
    }

    return { data: null, error: null };
}

export default function ProductModal() {
    const formRef = useRef<HTMLFormElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [state, action, isPending] = useActionState<ActionState, FormData>(
        handleCreateProduct,
        {
            data: null,
            error: null,
        },
    );

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
                    <ul>
                        {state.error?.fieldErrors.repo?.map(
                            function (error, i) {
                                return <li key={i}>{error}</li>;
                            },
                        )}
                        {state.error?.fieldErrors.name?.map(
                            function (error, i) {
                                return <li key={i}>{error}</li>;
                            },
                        )}
                        {state.error?.fieldErrors.price?.map(
                            function (error, i) {
                                return <li key={i}>{error}</li>;
                            },
                        )}
                        {state.error?.fieldErrors.image?.map(
                            function (error, i) {
                                return <li key={i}>{error}</li>;
                            },
                        )}
                    </ul>
                    <Form
                        ref={formRef}
                        action={action}
                        className="h-fit w-fit rounded-lg bg-white p-4"
                    >
                        <header>
                            <h1>Create Order</h1>
                        </header>
                        <main>
                            <div>
                                <label htmlFor="repo">Repository Name</label>
                                <input
                                    type="text"
                                    name="repo"
                                    id="repo"
                                    defaultValue={
                                        (state.data?.get("repo") as string) ||
                                        undefined
                                    }
                                />
                            </div>
                            <div>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    defaultValue={
                                        (state.data?.get("name") as string) ||
                                        undefined
                                    }
                                />
                            </div>
                            <div>
                                <label htmlFor="price">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    defaultValue={
                                        (state.data?.get(
                                            "price",
                                        ) as unknown as number) || undefined
                                    }
                                />
                            </div>
                            <div>
                                <label htmlFor="image">Image</label>
                                <input type="file" name="image" id="image" />
                            </div>
                        </main>
                        <footer>
                            <button type="submit">
                                {isPending
                                    ? "Creating product..."
                                    : "Create product"}
                            </button>
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
