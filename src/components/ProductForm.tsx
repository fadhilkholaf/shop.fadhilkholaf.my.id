import Form from "next/form";
import { useActionState, useEffect, useState } from "react";

import { type typeToFlattenedError } from "zod";

import { createProductAction, updateProductAction } from "@/actions/product";
import { type Product } from "@/prisma/generated";
import type {
    CreateProductSchema,
    UpdateProductSchema,
} from "@/schema/product";

import Input from "./input/Input";
import ImageInput from "./input/ImageInput";
import MarkdownInput from "./input/MarkdownInput";

type ActionState = {
    data: FormData | null;
    error: typeToFlattenedError<
        CreateProductSchema | UpdateProductSchema,
        string
    > | null;
};

const imagePlaceholder =
    "https://i.scdn.co/image/ab67616d0000b2732f7f3720b0f96f2e6e22b782";

async function actionHandler(
    prevState: ActionState,
    formData: FormData,
    closeModal: () => void,
    publicId?: string,
) {
    const image = formData.get("image") as File;

    if (image.size >= 1 * 1024 * 1024) {
        alert("File too large!");
        return { data: formData, error: null };
    }

    let response;

    if (publicId) {
        response = await updateProductAction(formData, publicId);
    } else {
        response = await createProductAction(formData);
    }

    if (!response.result) {
        if (typeof response.error === "string") {
            alert(response.error);

            return {
                data: formData,
                error: null,
            };
        }

        return {
            data: formData,
            error: response.error,
        };
    }

    closeModal();

    return { data: null, error: null };
}

export default function ProductForm({
    product,
    closeModal,
}: {
    product: Product | null;
    closeModal: () => void;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(
        product ? product.image : imagePlaceholder,
    );

    const [state, action, isPending] = useActionState<ActionState, FormData>(
        function (prevState, formData) {
            return actionHandler(
                prevState,
                formData,
                function () {
                    closeModal();
                },
                product ? product.publicId : undefined,
            );
        },
        {
            data: null,
            error: null,
        },
    );

    useEffect(() => {
        if (!file) {
            setPreviewUrl(product ? product.image : imagePlaceholder);
            return;
        }

        const objectUrl = URL.createObjectURL(file);

        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [file, product]);

    return (
        <Form
            action={function (formData) {
                action(formData);

                setFile(null);
            }}
            className="flex h-full flex-col gap-y-8"
        >
            <header className="flex items-center justify-between gap-x-4">
                <h1>New Product 🤔</h1>
                <button type="button" onClick={closeModal}>
                    Close
                </button>
            </header>
            <main className="flex h-full flex-col gap-y-4 overflow-y-scroll pr-4">
                <Input
                    label="Repo"
                    type="text"
                    name="repo"
                    id="repo"
                    defaultValue={
                        (state.data?.get("repo") as string) || undefined
                    }
                    errors={state.error?.fieldErrors.repo}
                />
                <Input
                    label="Name"
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={
                        product
                            ? product.name
                            : (state.data?.get("name") as string) || undefined
                    }
                    errors={state.error?.fieldErrors.name}
                />
                <Input
                    label="Category"
                    type="text"
                    name="category"
                    id="category"
                    defaultValue={
                        product
                            ? product.category
                            : (state.data?.get("category") as string) ||
                              undefined
                    }
                    errors={state.error?.fieldErrors.category}
                />
                <Input
                    label="Price"
                    type="number"
                    name="price"
                    id="price"
                    defaultValue={
                        product
                            ? product.price
                            : (state.data?.get("price") as string) || undefined
                    }
                    errors={state.error?.fieldErrors.price}
                />
                <ImageInput
                    label="Image"
                    preview={previewUrl}
                    name="image"
                    id="image"
                    onChange={function (e) {
                        setFile(e.target.files && e.target.files[0]);
                    }}
                    errors={state.error?.fieldErrors.image}
                />
                <MarkdownInput
                    label="Description"
                    name="description"
                    id="description"
                    rows={15}
                    defaultValue={
                        product
                            ? product.description
                            : (state.data?.get("description") as string) ||
                              undefined
                    }
                    errors={state.error?.fieldErrors.description}
                />
            </main>
            <footer>
                <button
                    type="submit"
                    className="bg-secondary text-primary w-full rounded-lg px-4 py-2 md:w-fit"
                >
                    {isPending ? "Creating product..." : "Create product"}
                </button>
            </footer>
        </Form>
    );
}
