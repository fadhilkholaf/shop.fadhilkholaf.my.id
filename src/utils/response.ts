import { ResponseTemplate } from "@/types/response";

export function responseSuccess<ResultTypeTemplate>(
    result: ResultTypeTemplate,
): ResponseTemplate<ResultTypeTemplate, null> {
    return { result, error: null };
}

export function responseError<ErrorTypeTemplate>(
    error: ErrorTypeTemplate,
): ResponseTemplate<null, ErrorTypeTemplate> {
    return { result: null, error };
}
