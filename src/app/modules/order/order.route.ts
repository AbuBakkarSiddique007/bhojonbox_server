
import { authenticate, authorize } from "../../middleware/auth.js";
import { orderController } from "./order.controller.js";
import { Role } from "@prisma/client";
import { Router } from "express";

const router = Router()

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
