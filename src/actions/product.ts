"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { Prisma } from "@/prisma/generated";
import { createProduct } from "@/query/product";
import { createProductSchema } from "@/schema/product";
import { generatePublicId } from "@/utils/public-id";

import { deleteImage, uploadImage } from "./cloudinary";
import { getGitHubRepository } from "./octokit";

export async function createProductAction(formData: FormData) {
    const publicId = generatePublicId();

    try {
        const session = await auth();

        if (!session) {
            return {
                success: false,
                message: "Unauthorized!",
                data: null,
            };
        }

        const parsedFormData = await createProductSchema.safeParseAsync(
            Object.fromEntries(formData),
        );

        if (!parsedFormData.success) {
            return {
                success: false,
                message: "Bad request!",
                data: parsedFormData.error.flatten(),
            };
        }

        const existingRepository = await getGitHubRepository(
            parsedFormData.data.repo,
        );

        if (!existingRepository) {
            return {
                success: false,
                message: "Repository not found!",
                data: null,
            };
        }

        const uploadedImage = await uploadImage(
            parsedFormData.data.image,
            "product",
            publicId,
        );

        if (!uploadedImage) {
            return {
                success: false,
                message: "Error uploading image!",
                data: null,
            };
        }

        const createdProduct = await createProduct({
            publicId,
            name: parsedFormData.data.name || parsedFormData.data.repo,
            category: parsedFormData.data.category,
            description: parsedFormData.data.description,
            price: parsedFormData.data.price,
            image: uploadedImage.secure_url,
            repositoryId: existingRepository.id,
            user: { connect: { githubId: session.user.githubId } },
        });

        revalidatePath("/", "layout");

        return {
            success: true,
            message: "Product created!",
            data: createdProduct,
        };
    } catch (error) {
        console.error(error);

        await deleteImage("product", publicId);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return {
                    success: false,
                    message: error.message,
                    data: null,
                };
            }
        }

        return {
            success: false,
            message: "Unexpected error creating product!",
            data: null,
        };
    }
}
