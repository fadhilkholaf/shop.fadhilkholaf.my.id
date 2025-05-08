export function responseSuccess<Data>(message: string, data: Data) {
    return { success: true, message, data };
}

export function responseError<Data>(message: string, data: Data) {
    return { success: false, message, data };
}
