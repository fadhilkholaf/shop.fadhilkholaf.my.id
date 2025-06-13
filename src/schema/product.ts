import { z } from "zod";

export const createProductSchema = z
    .object({
        repo: z.string().nonempty("Repository name required!"),
        name: z.string().optional(),
        category: z.string().nonempty("Product category required!"),
        price: z.number({ coerce: true }).int().positive(),
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
