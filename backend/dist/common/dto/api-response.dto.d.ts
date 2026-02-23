export declare class ApiResponse<T> {
    data: T;
    message: string;
    statusCode: number;
    constructor(data: T, message: string, statusCode?: number);
}
