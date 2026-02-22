import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.js";
import { adminController } from "./admin.controller.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();

// Admin-only routes:
router.use(authenticate, authorize(Role.ADMIN));

// Dashboard:
router.get("/dashboard", adminController.getDashboardStats);


// User management:
router.get("/users", adminController.getAllUsers);

router.get("/users/:id", adminController.getUserById);

router.patch("/users/:id/toggle-status", adminController.toggleUserStatus);

router.patch("/users/:id/role", adminController.changeUserRole);

// Orders:
router.get("/orders", adminController.getAllOrders);

export const adminRouter = router;
