import express from "express";
import { paymentController } from "./payment.controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/create-intent",
  authenticate,
  paymentController.createIntent
);

router.post(
  "/webhook",
  paymentController.webhook
);

export const paymentRouter = router;
