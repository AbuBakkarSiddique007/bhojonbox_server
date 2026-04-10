import express from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { orderController } from "./order.controller";
import { Role } from "../../../../generated/prisma/enums";
const router = express.Router();
// Customer routes:
router.post("/", authenticate, authorize(Role.CUSTOMER), orderController.createOrder);
router.get("/my-orders", authenticate, authorize(Role.CUSTOMER), orderController.getMyOrders);
router.patch("/:id/cancel", authenticate, authorize(Role.CUSTOMER), orderController.cancelOrder);
// Provider routes:
router.get("/provider/orders", authenticate, authorize(Role.PROVIDER), orderController.getProviderOrders);
router.patch("/:id/status", authenticate, authorize(Role.PROVIDER), orderController.updateOrderStatus);
// Shared routes:
// Customer can view their orders, 
// Provider can view orders for their meals
router.get("/:id", authenticate, orderController.getOrderById);
export const orderRouter = router;
//# sourceMappingURL=order.route.js.map