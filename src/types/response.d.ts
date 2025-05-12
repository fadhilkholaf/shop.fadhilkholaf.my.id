export type ResponseTemplate<Data, Error> = {
    success: boolean;
    message: string;
    data: Data;
    error: Error;
};
