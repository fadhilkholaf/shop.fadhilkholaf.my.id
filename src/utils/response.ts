import { ResponseTemplate } from "@/types/response";

export function responseSuccess<Data>(
    message: string,
    data: Data,
): ResponseTemplate<Data, null> {
    return { success: true, message, data, error: null };
}

export function responseError<Data, Error>(
    message: string,
    data: Data,
    error: Error,
): ResponseTemplate<Data, Error> {
    return { success: false, message, data, error };
}
