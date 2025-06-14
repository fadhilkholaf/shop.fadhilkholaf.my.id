"use client";

import Form from "next/form";
// import Image from "next/image";
import {
    ComponentPropsWithoutRef,
    useActionState,
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "motion/react";
import Markdown from "react-markdown";
import { typeToFlattenedError } from "zod";

import { createProductAction } from "@/actions/product";
import { useProductModal } from "@/context/ProductModalContext";
import { CreateProductSchema } from "@/schema/product";
import { cn } from "@/utils/cn";
import { cartModalVariants, modalVariants } from "@/utils/motion-variants";
import Image from "next/image";

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
    const modalRef = useRef<HTMLDivElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(
        "https://i.scdn.co/image/ab67616d0000b2732f7f3720b0f96f2e6e22b782",
    );

    const [state, action, isPending] = useActionState<ActionState, FormData>(
        handleCreateProduct,
        {
            data: null,
            error: null,
        },
    );

    const { isOpen, setIsOpen } = useProductModal();

    useEffect(() => {
        if (!file) {
            setPreviewUrl(
                "https://i.scdn.co/image/ab67616d0000b2732f7f3720b0f96f2e6e22b782",
            );
            return;
        }

        const objectUrl = URL.createObjectURL(file);

        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [file]);

    useEffect(
        function () {
            const modalElement = modalRef.current;

            function handleClick(e: MouseEvent) {
                const target = e.target as Node;

                if (isOpen && modalElement && !modalElement.contains(target)) {
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
                                    "flex items-end justify-end",
                                    "backdrop-brightness-50",
                                )}
                            >
                                <motion.div
                                    ref={modalRef}
                                    variants={cartModalVariants}
                                    className={cn(
                                        "cart-modal",
                                        "h-3/4 w-full p-8 md:h-full md:w-3/4",
                                        "flex flex-col justify-between gap-y-8",
                                        "bg-primary text-secondary rounded-t-lg md:rounded-t-none md:rounded-l-lg",
                                    )}
                                >
                                    <Form
                                        action={function (formData) {
                                            action(formData);

                                            setFile(null);
                                        }}
                                        className="flex flex-col gap-y-8 overflow-y-scroll pr-4"
                                    >
                                        <header>
                                            <h1>New Product 🤔</h1>
                                        </header>
                                        <main className="flex flex-col gap-y-4">
                                            <Input
                                                label="Repo"
                                                type="text"
                                                name="repo"
                                                id="repo"
                                                defaultValue={
                                                    (state.data?.get(
                                                        "repo",
                                                    ) as string) || undefined
                                                }
                                                errors={
                                                    state.error?.fieldErrors
                                                        .repo
                                                }
                                            />
                                            <Input
                                                label="Name"
                                                type="text"
                                                name="name"
                                                id="name"
                                                defaultValue={
                                                    (state.data?.get(
                                                        "name",
                                                    ) as string) || undefined
                                                }
                                                errors={
                                                    state.error?.fieldErrors
                                                        .name
                                                }
                                            />
                                            <Input
                                                label="Category"
                                                type="text"
                                                name="category"
                                                id="category"
                                                defaultValue={
                                                    (state.data?.get(
                                                        "category",
                                                    ) as string) || undefined
                                                }
                                                errors={
                                                    state.error?.fieldErrors
                                                        .category
                                                }
                                            />
                                            <Input
                                                label="Price"
                                                type="number"
                                                name="price"
                                                id="price"
                                                defaultValue={
                                                    (state.data?.get(
                                                        "price",
                                                    ) as string) || undefined
                                                }
                                                errors={
                                                    state.error?.fieldErrors
                                                        .price
                                                }
                                            />
                                            <ImageInput
                                                label="Image"
                                                preview={previewUrl}
                                                name="image"
                                                id="image"
                                                onChange={function (e) {
                                                    setFile(
                                                        e.target.files &&
                                                            e.target.files[0],
                                                    );
                                                }}
                                                errors={
                                                    state.error?.fieldErrors
                                                        .image
                                                }
                                            />
                                            <MarkdownEditor
                                                label="Description"
                                                name="description"
                                                id="description"
                                                rows={15}
                                                errors={
                                                    state.error?.fieldErrors
                                                        .description
                                                }
                                            />
                                        </main>
                                        <footer>
                                            <button type="submit">
                                                {isPending
                                                    ? "Creating product..."
                                                    : "Create product"}
                                            </button>
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

function Input({
    label,
    errors,
    ...props
}: { label: string; errors?: string[] } & ComponentPropsWithoutRef<"input">) {
    return (
        <article className="flex flex-col">
            <label htmlFor={props.id}>{label}</label>
            <input
                className="border-secondary rounded-lg border px-2 py-1"
                {...props}
            />
            <ul className="flex list-disc flex-col pl-4.5">
                {errors?.map(function (error, i) {
                    return (
                        <li key={i} className="text-error">
                            <p>{error}</p>
                        </li>
                    );
                })}
            </ul>
        </article>
    );
}

function ImageInput({
    label,
    preview,
    errors,
    ...props
}: { label: string; preview: string; errors?: string[] } & Omit<
    ComponentPropsWithoutRef<"input">,
    "type" | "accept"
>) {
    return (
        <article className="flex flex-col">
            <Image
                src={preview}
                alt="Product image"
                width={1024}
                height={1024}
                priority
                className="aspect-video rounded-lg object-cover"
            />
            <label htmlFor={props.id}>{label}</label>
            <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/gif"
                className="border-secondary rounded-lg border px-2 py-1"
                {...props}
            />
            <ul className="flex list-disc flex-col pl-4.5">
                {errors?.map(function (error, i) {
                    return (
                        <li key={i} className="text-error">
                            <p>{error}</p>
                        </li>
                    );
                })}
            </ul>
        </article>
    );
}

function MarkdownEditor({
    label,
    errors,
    ...props
}: {
    label: string;
    errors?: string[];
} & ComponentPropsWithoutRef<"textarea">) {
    const [value, setValue] = useState<string | undefined>();

    return (
        <article className="flex flex-col">
            <label htmlFor={props.id}>{label}</label>
            <div>
                <Markdown>{value}</Markdown>
            </div>
            <textarea
                value={value}
                onChange={function (e) {
                    setValue(e.target.value);
                }}
                className="border-secondary rounded-lg border px-2 py-1"
                {...props}
            />
            <ul className="flex list-disc flex-col pl-4.5">
                {errors?.map(function (error, i) {
                    return (
                        <li key={i} className="text-error">
                            <p>{error}</p>
                        </li>
                    );
                })}
            </ul>
        </article>
    );
}
