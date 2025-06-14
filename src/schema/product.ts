import { z } from "zod";

export const createProductSchema = z
    .object({
        repo: z.string().nonempty("Repo field required!"),
        name: z.string().optional(),
        category: z.string().nonempty("Category field required!"),
        description: z.string().nonempty("Description field required!"),
        price: z
            .number({ coerce: true })
            .int("Price must be a number!")
            .positive("Price must be a positive number!"),
        image: z.instanceof(File).refine(function (file) {
            return new Set([
                "image/png",
                "image/jpeg",
                "image/jpg",
                "image/svg+xml",
                "image/gif",
            ]).has(file.type);
        }, "Invalid image type!"),
    })
    .strict();

export type CreateProductSchema = z.infer<typeof createProductSchema>;
