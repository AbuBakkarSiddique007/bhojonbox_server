import type { Response } from "express";

type ResponseData = {
    statusCode?: number;
    success?: boolean;
    message?: string;
    data?: any;
};

export function sendResponse(res: Response, {
    statusCode = 200,
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
    if (err.status) {
        return sendResponse(res, {
            statusCode: err.status,
            success: false,
            message: err.message,
        });
    }

    sendResponse(res, {
        statusCode: 500,
        success: false,
        message: message,
        data: { error: err.message },
    });
}
