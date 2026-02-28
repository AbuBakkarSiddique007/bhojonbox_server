export function sendResponse(res, { statusCode = 200, success = true, message, data, }) {
    res.status(statusCode).json({
        success,
        message,
        ...data && { data },
    });
}
export function handleError(res, err, message) {
    if (err && typeof err.status === "number") {
        return sendResponse(res, {
            statusCode: err.status,
            success: false,
            message: err.message || message,
        });
    }
    console.error("Unhandled error:", err);
    sendResponse(res, {
        statusCode: 500,
        success: false,
        message: message || "Internal Server Error",
    });
}
//# sourceMappingURL=sendResponse.js.map