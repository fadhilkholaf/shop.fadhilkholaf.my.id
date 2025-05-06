"use server";

import { auth } from "@/lib/auth";
import { Prisma } from "@/prisma/generated";
import { createProduct } from "@/query/product";
import { createProductSchema } from "@/schema/product";

import { uploadImage } from "./cloudinary";
import { getGithubRepository } from "./github";

export async function createProductAction(formData: FormData) {
    try {
        const session = await auth();

        if (!session) {
            return {
                success: false,
                message: "Unauthorized!",
                data: null,
            };
        }

        const parsedFormData = createProductSchema.safeParse(
            Object.fromEntries(formData),
        );

        if (!parsedFormData.success) {
            return {
                success: false,
                message: "Bad request!",
                data: parsedFormData.error.flatten(),
            };
        }

        const existingRepository = await getGithubRepository(
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
            existingRepository.id.toString(),
            "product",
        );

        if (!uploadedImage) {
            return {
                success: false,
                message: "Error uploading image!",
                data: null,
            };
        }

        const createdProduct = await createProduct({
            name: parsedFormData.data.name ?? parsedFormData.data.repo,
            price: parsedFormData.data.price,
            image: uploadedImage.secure_url,
            repositoryId: existingRepository.id,
            user: { connect: { githubId: session.user.githubId } },
        });

        return {
            success: true,
            message: "Product created!",
            data: createdProduct,
        };
    } catch (error) {
        console.log(error);

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
