import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { reviewService } from "./review.service.js";


const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const { mealId, orderId, rating, comment } = req.body;

        if (!mealId || !orderId || !rating) {
            res.status(400).json({
                message: "mealId, orderId and rating are required",
            });

            return;
        }

        if (rating < 1 || rating > 5) {
            res.status(400).json({
                message: "Rating must be between 1 and 5",
            });

            return;
        }

        const review = await reviewService.createReview(req.user!.id, {
            mealId,
            orderId,
            rating: parseInt(rating),
            comment,
        });

        res.status(201).json({ review });

    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({ 
                message: err.message 
            });

            return;
        }
        res.status(500).json({
            message: "Failed to create review",
            error: err.message,
        });
    }
};


const getReviewsByMeal = async (req: Request, res: Response) => {
    try {
        const result = await reviewService.getReviewsByMeal(req.params.mealId as string);

        res.status(200).json(result);
        
    } catch (err: any) {
        res.status(500).json({
            message: "Failed to fetch reviews",
            error: err.message,
        });
    }
};


const getReviewById = async (req: Request, res: Response) => {
    try {
        const review = await reviewService.getReviewById(req.params.id as string);

        if (!review) {
            res.status(404).json({ message: "Review not found" });
            return;
        }

        res.status(200).json({ review });
    } catch (err: any) {
        res.status(500).json({
            message: "Failed to fetch review",
            error: err.message,
        });
    }
};


const getMyReviews = async (req: AuthRequest, res: Response) => {
    try {
        const reviews = await reviewService.getMyReviews(req.user!.id);

        res.status(200).json({ reviews });
    } catch (err: any) {
        res.status(500).json({
            message: "Failed to fetch my reviews",
            error: err.message,
        });
    }
};


const updateReview = async (req: AuthRequest, res: Response) => {
    try {
        const { rating, comment } = req.body;

        if (rating && (rating < 1 || rating > 5)) {
            res.status(400).json({
                message: "Rating must be between 1 and 5",
            });
            return;
        }

        const review = await reviewService.updateReview(req.user!.id, req.params.id as string, {
            rating: rating ? parseInt(rating) : undefined,
            comment,
        });

        res.status(200).json({ review });
    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({ 
                message: err.message 
            });
            return;
        }
        res.status(500).json({
            message: "Failed to update review",
            error: err.message,
        });
    }
};


const deleteReview = async (req: AuthRequest, res: Response) => {
    try {
        await reviewService.deleteReview(req.user!.id, req.params.id as string, req.user!.role);

        res.status(200).json({ message: "Review deleted" });
    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({ 
                message: err.message 
            });
            return;
        }
        res.status(500).json({
            message: "Failed to delete review",
            error: err.message,
        });
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
