import express from "express";
import type { Router } from 'express';
import { authenticate, authorize } from "../../middleware/auth";
import { categoryController } from "./category.controller.js";
import { Role } from "../../../../generated/prisma/enums";

const router = express.Router();

// Public routes:
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);


// Admin only routes:
router.post("/", authenticate, authorize(Role.ADMIN), categoryController.createCategory);

router.put("/:id", authenticate, authorize(Role.ADMIN), categoryController.updateCategory);

router.delete("/:id", authenticate, authorize(Role.ADMIN), categoryController.deleteCategory);

export const categoryRouter: Router = router;
