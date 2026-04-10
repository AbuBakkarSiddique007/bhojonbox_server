import express from "express";
import type { Router } from 'express';
import { authenticate, authorize } from "../../middleware/auth";
import { mealController } from "./meal.controller.js";
import { Role } from "../../../../generated/prisma/enums";

const router = express.Router();

// Public routes:
router.get("/", mealController.getAllMeals);

router.get("/provider/my-meals", authenticate, authorize(Role.PROVIDER), mealController.getMyMeals);

router.get("/:id", mealController.getMealById);


// Provider routes:
router.post("/", authenticate, authorize(Role.PROVIDER), mealController.createMeal);

router.put("/:id", authenticate, authorize(Role.PROVIDER), mealController.updateMeal);

router.delete("/:id", authenticate, authorize(Role.PROVIDER), mealController.deleteMeal);

export const mealRouter: Router = router;