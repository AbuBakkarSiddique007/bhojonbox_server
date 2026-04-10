import type { Response } from "express";
import status from 'http-status';
import AppError from '../errorHelpers/AppError.js';

type ResponseData = {
    statusCode?: number;
    success?: boolean;
    message?: string;
    data?: any;
};

export function sendResponse(res: Response, {
    statusCode = status.OK,
    success = true,
    message,
    data,
}: ResponseData) {
    res.status(statusCode).json({
        success,
        message,
        ...data && { data },
    });
}

export function handleError(res: Response, err: any, message: string) {
    
    if (err instanceof AppError || (err && typeof err.statusCode === 'number')) {
        const statusCode = err.statusCode ?? err.status;
        return sendResponse(res, {
            statusCode,
            success: false,
            message: err.message || message,
        });
    }

    if (err && typeof err.status === "number") {
        return sendResponse(res, {
            statusCode: err.status,
            success: false,
            message: err.message || message,
        });
    }

    console.error("Unhandled error:", err);

    sendResponse(res, {
        statusCode: status.INTERNAL_SERVER_ERROR,
        success: false,
        message: message || "Internal Server Error",
    });
}
