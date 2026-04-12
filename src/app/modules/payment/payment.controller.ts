import { Request, Response } from "express";
import httpStatus from "http-status";
import { paymentService } from "./payment.service.js";
import { handleError } from "../../utils/sendResponse.js";

const createIntent = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const user = (req as any).user;

    const result = await paymentService.createPaymentIntent(orderId, user.id);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Payment intent created successfully",
      data: result,
    });
  } catch (err: any) {
    handleError(res, err, "Failed to create payment intent");
  }
};

const webhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["stripe-signature"] as string;
    const payload = req.body; 

    const result = await paymentService.handleWebhook(signature, payload);

    res.status(httpStatus.OK).json(result);
  } catch (err: any) {
    handleError(res, err, "Webhook processing failed");
  }
};

export const paymentController = {
  createIntent,
  webhook,
};
