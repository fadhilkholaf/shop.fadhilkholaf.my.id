"use server";

import { type UploadApiResponse } from "cloudinary";

import cloudinary from "@/lib/cloudinary";
import { type ResponseTemplate } from "@/types/response";
import { responseError, responseSuccess } from "@/utils/response";

type UploadImageType = "profile" | "product";

export async function uploadImage(
    file: File,
    type: UploadImageType,
    fileName: string,
): Promise<
    ResponseTemplate<UploadApiResponse, null> | ResponseTemplate<null, string>
> {
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
            return responseError("Error uploading image!");
        }

        return responseSuccess(response);
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error uploading image!");
    }
}

export async function deleteImage(
    type: UploadImageType,
    fileName: string,
): Promise<ResponseTemplate<string, null> | ResponseTemplate<null, string>> {
    try {
        await cloudinary.uploader.destroy(`shop/${type}/${fileName}`);

        return responseSuccess("Image deleted!");
    } catch (error) {
        console.error(error);

        return responseError("Unexpected error deleting image!");
    }
}
