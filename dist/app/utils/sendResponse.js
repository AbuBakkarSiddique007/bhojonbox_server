import status from 'http-status';
import AppError from '../errorHelpers/AppError.js';
export function sendResponse(res, { statusCode = status.OK, success = true, message, data, }) {
    res.status(statusCode).json({
        success,
        message,
        ...data && { data },
    });
}
export function handleError(res, err, message) {
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
//# sourceMappingURL=sendResponse.js.map