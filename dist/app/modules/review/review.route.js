import { authenticate, authorize } from "../../middleware/auth.js";
import { reviewController } from "./review.controller.js";
import { Role } from "@prisma/client";
import { Router } from "express";
const router = Router();
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
export const reviewRouter = router;
//# sourceMappingURL=review.route.js.map