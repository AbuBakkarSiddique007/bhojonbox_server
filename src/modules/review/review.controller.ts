import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { reviewService } from "./review.service.js";
import { sendResponse, handleError } from "../../utils/sendResponse.js";


const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const { mealId, orderId, rating, comment } = req.body;

        if (!mealId || !orderId || !rating) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "mealId, orderId and rating are required",
            });
        }

        if (rating < 1 || rating > 5) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        const review = await reviewService.createReview(req.user!.id, {
            mealId,
            orderId,
            rating: parseInt(rating),
            comment,
        });

        sendResponse(res, {
            statusCode: 201,
            message: "Review created successfully",
            data: { review },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to create review");
    }
};


const getReviewsByMeal = async (req: Request, res: Response) => {
    try {
        const result = await reviewService.getReviewsByMeal(req.params.mealId as string);

        sendResponse(res, {
            message: "Reviews fetched successfully",
            data: result,
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch reviews");
    }
};


const getReviewById = async (req: Request, res: Response) => {
    try {
        const review = await reviewService.getReviewById(req.params.id as string);

        if (!review) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Review not found",
            });
        }

        sendResponse(res, {
            message: "Review fetched successfully",
            data: { review },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch review");
    }
};


const getMyReviews = async (req: AuthRequest, res: Response) => {
    try {
        const reviews = await reviewService.getMyReviews(req.user!.id);

        sendResponse(res, {
            message: "My reviews fetched successfully",
            data: { reviews },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch my reviews");
    }
};


const updateReview = async (req: AuthRequest, res: Response) => {
    try {
        const { rating, comment } = req.body;

        if (rating && (rating < 1 || rating > 5)) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        const review = await reviewService.updateReview(req.user!.id, req.params.id as string, {
            rating: rating ? parseInt(rating) : undefined,
            comment,
        });

        sendResponse(res, {
            message: "Review updated successfully",
            data: { review },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to update review");
    }
};


const deleteReview = async (req: AuthRequest, res: Response) => {
    try {
        await reviewService.deleteReview(req.user!.id, req.params.id as string, req.user!.role);

        sendResponse(res, {
            message: "Review deleted successfully",
        });
    } catch (err: any) {
        handleError(res, err, "Failed to delete review");
    }
};


export const reviewController = {
    createReview,
    getReviewsByMeal,
    getReviewById,
    getMyReviews,
    updateReview,
    deleteReview,
};
