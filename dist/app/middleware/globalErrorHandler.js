import { Prisma } from "../../generated/prisma/client.js";
import { sendResponse } from "../utils/sendResponse.js";
function errorHandler(err, req, res, next) {
    let statusCode = err.status || 500;
    let errorMessage = err.message || "Internal Server Error";
    // PrismaClientValidationError:
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "You provided incorrect field types or missing fields!";
    }
    // PrismaClientKnownRequestError:
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 404;
            errorMessage = "Requested record not found.";
        }
        else if (err.code === "P2002") {
            statusCode = 409;
            errorMessage = "Unique constraint failed (duplicate value).";
        }
        else if (err.code === "P2003") {
            statusCode = 409;
            errorMessage = "Foreign key constraint failed.";
        }
        else {
            statusCode = 400;
            errorMessage = "Bad request to database.";
        }
    }
    // PrismaClientUnknownRequestError:
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = "Error occurred during query execution!";
    }
    // PrismaClientRustPanicError:
    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = 500;
        errorMessage = "Database engine encountered a fatal error.";
    }
    // PrismaClientInitializationError:
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = 500;
            errorMessage = "Database authentication failed. Check credentials/configuration.";
        }
        else if (err.errorCode === "P1001") {
            statusCode = 503;
            errorMessage = "Cannot reach database server.";
        }
    }
    sendResponse(res, {
        statusCode,
        success: false,
        message: errorMessage,
    });
}
export default errorHandler;
//# sourceMappingURL=globalErrorHandler.js.map