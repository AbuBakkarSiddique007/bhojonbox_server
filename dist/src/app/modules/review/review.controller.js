import status from 'http-status';
import { reviewService } from "./review.service";
import { sendResponse, handleError } from "../../utils/sendResponse";
const createReview = async (req, res) => {
    try {
        const { mealId, orderId, rating, comment } = req.body;
        if (!mealId || !orderId || !rating) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "mealId, orderId and rating are required",
            });
        }
        if (rating < 1 || rating > 5) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }
        const review = await reviewService.createReview(req.user.id, {
            mealId,
            orderId,
            rating: parseInt(rating),
            comment,
        });
        sendResponse(res, {
            statusCode: status.CREATED,
            message: "Review created successfully",
            data: { review },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to create review");
    }
};
const getReviewsByMeal = async (req, res) => {
    try {
        const result = await reviewService.getReviewsByMeal(req.params.mealId);
        sendResponse(res, {
            message: "Reviews fetched successfully",
            data: result,
        });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch reviews");
    }
};
const getReviewById = async (req, res) => {
    try {
        const review = await reviewService.getReviewById(req.params.id);
        if (!review) {
            return sendResponse(res, {
                statusCode: status.NOT_FOUND,
                success: false,
                message: "Review not found",
            });
        }
        sendResponse(res, {
            message: "Review fetched successfully",
            data: { review },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch review");
    }
};
const getMyReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getMyReviews(req.user.id);
        sendResponse(res, {
            message: "My reviews fetched successfully",
            data: { reviews },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch my reviews");
    }
};
const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        if (rating && (rating < 1 || rating > 5)) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }
        const review = await reviewService.updateReview(req.user.id, req.params.id, {
            rating: rating ? parseInt(rating) : undefined,
            comment,
        });
        sendResponse(res, {
            message: "Review updated successfully",
            data: { review },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to update review");
    }
};
const deleteReview = async (req, res) => {
    try {
        await reviewService.deleteReview(req.user.id, req.params.id, req.user.role);
        sendResponse(res, {
            message: "Review deleted successfully",
        });
    }
    catch (err) {
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
//# sourceMappingURL=review.controller.js.map