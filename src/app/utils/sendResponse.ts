import type { Response } from "express";
import status from 'http-status';
import AppError from '../errorHelpers/AppError.js';

type ResponseData<T = unknown> = {
    statusCode?: number;
    success?: boolean;
    message?: string;
    data?: T;
};

export function sendResponse<T = unknown>(res: Response, {
    statusCode = status.OK,
    success = true,
    message,
    data,
}: ResponseData<T>) {
    res.status(statusCode).json({
        success,
        message,
        ...(data !== undefined && { data }),
    });
}

export function handleError(res: Response, err: unknown, message: string) {
    if (err instanceof AppError) {
        return sendResponse(res, {
            statusCode: err.statusCode,
            success: false,
            message: err.message || message,
        });
    }

    if (err && typeof err === "object") {
        const errorObj = err as Record<string, unknown>;
        const statusCode = typeof errorObj.statusCode === "number" 
            ? errorObj.statusCode 
            : typeof errorObj.status === "number" 
            ? errorObj.status 
            : undefined;

        if (statusCode) {
            return sendResponse(res, {
                statusCode,
                success: false,
                message: (typeof errorObj.message === "string" ? errorObj.message : null) || message,
            });
        }
    }

    console.error("Unhandled error:", err);

    const errorMessage = err instanceof Error ? err.message : message || "Internal Server Error";

    sendResponse(res, {
        statusCode: status.INTERNAL_SERVER_ERROR,
        success: false,
        message: errorMessage,
    });
}
