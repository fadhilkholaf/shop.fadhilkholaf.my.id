import { z } from "zod";

export const createProductSchema = z.object({
    repo: z.string().nonempty(),
    name: z.string().optional(),
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
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
