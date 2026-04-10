import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { adminController } from "./admin.controller";
import { Role } from "../../../../generated/prisma/enums";
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
//# sourceMappingURL=admin.route.js.map