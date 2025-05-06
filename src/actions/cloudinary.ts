"use server";

import { UploadApiResponse } from "cloudinary";

import cloudinary from "@/lib/cloudinary";

export async function uploadImage(
    file: File,
    fileName: string,
    type: "profile" | "product",
) {
    try {
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const response: UploadApiResponse | undefined = await new Promise(
            function (resolve, reject) {
                cloudinary.uploader
                    .upload_stream(
                        {
                            upload_preset: `shop-${type}`,
                            public_id: fileName,
                        },
                        function (err, res) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(res);
                            }
                        },
                    )
                    .end(fileBuffer);
            },
        );

        if (!response) {
            return null;
        }

        return response;
    } catch (error) {
        console.log(error);

        return null;
    }
}

export const deleteImage = async (id: string) => {
    try {
        await cloudinary.uploader.destroy(id);

        return { success: true, message: "Image deleted" };
    } catch (error) {
        console.log(error);

        return null;
    }
};
