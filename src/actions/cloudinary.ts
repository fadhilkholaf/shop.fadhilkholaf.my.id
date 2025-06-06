"use server";

import { UploadApiResponse } from "cloudinary";

import cloudinary from "@/lib/cloudinary";

type UploadImageType = "profile" | "product";

export async function uploadImage(
    file: File,
    type: UploadImageType,
    fileName: string,
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
        console.error(error);

        return null;
    }
}

export const deleteImage = async (type: UploadImageType, fileName: string) => {
    try {
        await cloudinary.uploader.destroy(`shop/${type}/${fileName}`);

        return { success: true, message: "Image deleted!", data: null };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Unexpected error deleting image!",
            data: null,
        };
    }
};
