import type { Response } from "express";
type ResponseData = {
    statusCode?: number;
    success?: boolean;
    message?: string;
    data?: any;
};
export declare function sendResponse(res: Response, { statusCode, success, message, data, }: ResponseData): void;
export declare function handleError(res: Response, err: any, message: string): void;
export {};
