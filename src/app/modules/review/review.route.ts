import express from "express";
import type { Router } from 'express';
import { authenticate, authorize } from "../../middleware/auth";
import { reviewController } from "./review.controller";
import { Role } from "../../../../generated/prisma/enums";

const router = express.Router();

// Public routes:
router.get("/meal/:mealId", reviewController.getReviewsByMeal);


// Customer routes:
router.post("/", authenticate, authorize(Role.CUSTOMER), reviewController.createReview);

router.get("/user/my-reviews", authenticate, authorize(Role.CUSTOMER), reviewController.getMyReviews);

router.put("/:id", authenticate, authorize(Role.CUSTOMER), reviewController.updateReview);


// Customer or Admin can delete:
router.delete("/:id", authenticate, authorize(Role.CUSTOMER, Role.ADMIN), reviewController.deleteReview);


// Get single review by ID (public):
router.get("/:id", reviewController.getReviewById);

export const reviewRouter: Router = router;
