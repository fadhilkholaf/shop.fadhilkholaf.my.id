"use server";

import { revalidatePath } from "next/cache";

import {
    createProduct,
    deleteProduct,
    getProduct,
    updateProduct,
} from "@/database/product";
import { auth } from "@/lib/auth";
import { type Product } from "@/prisma/generated";
import {
    type CreateProductSchema,
    createProductSchema,
    updateProductSchema,
    UpdateProductSchema,
} from "@/schema/product";
import { type ResponseTemplate } from "@/types/response";
import { generatePublicId } from "@/utils/public-id";
import { responseError, responseSuccess } from "@/utils/response";
import { type typeToFlattenedError } from "zod";

import { deleteImage, uploadImage } from "./cloudinary";
import { getGitHubRepository } from "./octokit";

export async function createProductAction(
    formData: FormData,
): Promise<
    | ResponseTemplate<Product, null>
    | ResponseTemplate<null, typeToFlattenedError<CreateProductSchema> | string>
> {
    const publicId = generatePublicId();

    try {
        const session = await auth();

        if (!session) {
            return responseError("Unauthenticated user!");
        }

        if (session.user.role !== "admin") {
            return responseError("Unauthorized user!");
        }

        const parsedFormData = await createProductSchema.safeParseAsync(
            Object.fromEntries(formData),
        );

        if (!parsedFormData.success) {
            return responseError(parsedFormData.error.flatten());
        }

        const { category, description, image, price, repo, name } =
            parsedFormData.data;

        const existingRepository = await getGitHubRepository(repo);

        if (!existingRepository.result) {
            return existingRepository;
        }

        const existingProduct = await getProduct({
            repositoryId: existingRepository.result.id,
        });

        if (existingProduct) {
            return responseError("Product with this repo already exist!");
        }

        const uploadedImage = await uploadImage(image, "product", publicId);

        if (!uploadedImage.result) {
            return uploadedImage;
        }

        const createdProduct = await createProduct({
            publicId,
            name: name || repo,
            category: category,
            description: description,
            price: price,
            image: uploadedImage.result.secure_url,
            repositoryId: existingRepository.result.id,
            user: { connect: { githubId: session.user.githubId } },
        });

        revalidatePath("/", "layout");

        return responseSuccess(createdProduct);
    } catch (error) {
        console.error(error);

        await deleteImage("product", publicId);

        return responseError("Unexpected error creating product!");
    }
}

export async function updateProductAction(
    formData: FormData,
    publicId: string,
): Promise<
    | ResponseTemplate<Product, null>
    | ResponseTemplate<null, typeToFlattenedError<UpdateProductSchema> | string>
> {
    try {
        const session = await auth();

        if (!session) {
            return responseError("Unauthenticated user!");
        }

        if (session.user.role !== "admin") {
            return responseError("Unauthorized user!");
        }

        const parsedFormData = await updateProductSchema.safeParseAsync(
            Object.fromEntries(formData),
        );

        if (!parsedFormData.success) {
            return responseError(parsedFormData.error.flatten());
        }

        const { image, category, description, name, price, repo } =
            parsedFormData.data;

        let repositoryId: number | undefined = undefined;

        if (repo && repo !== "") {
            const existingRepository = await getGitHubRepository(repo);

            if (!existingRepository.result) {
                return existingRepository;
            }

            repositoryId = existingRepository.result.id;

            const existingProduct = await getProduct({ repositoryId });

            if (existingProduct) {
                return responseError("Product with this repo already exist!");
            }
        }

        let imageUrl: string | undefined = undefined;

        if (image.size !== 0) {
            const uploadedImage = await uploadImage(
                parsedFormData.data.image,
                "product",
                publicId,
            );

            if (!uploadedImage.result) {
                return uploadedImage;
            }

            imageUrl = uploadedImage.result.secure_url;
        }

        const updatedProduct = await updateProduct(
            { publicId },
            {
                category: category !== "" ? category : undefined,
                description: description !== "" ? description : undefined,
                image: imageUrl !== "" ? imageUrl : undefined,
                name: name !== "" ? name : undefined,
                price: price,
                repositoryId,
            },
        );

        revalidatePath("/", "layout");

        return responseSuccess(updatedProduct);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error updating product!");
    }
}

export async function deleteProductAction(
    publicId: string,
): Promise<ResponseTemplate<Product, null> | ResponseTemplate<null, string>> {
    try {
        const session = await auth();

        if (!session) {
            return responseError("Unauthenticated user!");
        }

        if (session.user.role !== "admin") {
            return responseError("Unauthorized user!");
        }

        const existingProduct = await getProduct({ publicId });

        if (!existingProduct) {
            return responseError("Product does not exist!");
        }

        const deletedProduct = await deleteProduct({ publicId });

        await deleteImage("product", publicId);

        revalidatePath("/", "layout");

        return responseSuccess(deletedProduct);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error deleting product!");
    }
}
