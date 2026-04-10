import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const reviewController: {
    createReview: (req: AuthRequest, res: Response) => Promise<void>;
    getReviewsByMeal: (req: Request, res: Response) => Promise<void>;
    getReviewById: (req: Request, res: Response) => Promise<void>;
    getMyReviews: (req: AuthRequest, res: Response) => Promise<void>;
    updateReview: (req: AuthRequest, res: Response) => Promise<void>;
    deleteReview: (req: AuthRequest, res: Response) => Promise<void>;
};
