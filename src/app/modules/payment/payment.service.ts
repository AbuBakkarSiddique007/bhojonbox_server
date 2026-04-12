import Stripe from "stripe";
import { prisma } from "../../lib/prisma.js";
import { envVars } from "../../config/env.js";
import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError.js";
import { OrderStatus, PaymentStatus } from "@prisma/client";

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY as string);

const createPaymentIntent = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.userId !== userId) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (order.paymentStatus === PaymentStatus.PAID) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order is already paid");
  }

  const amount = Math.round(order.totalAmount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "bdt",
    metadata: {
      orderId: order.id,
      userId: order.userId,
    },
    payment_method_types: ["card"],
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
};

const handleWebhook = async (signature: string, payload: Buffer) => {
  const webhookSecret = envVars.STRIPE_WEBHOOK_SECRET as string;
  let event: any;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as any;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          transactionId: paymentIntent.id,
        },
      });
      console.log(`Payment confirmed for order: ${orderId}`);
    }
  }

  return { received: true };
};

export const paymentService = {
  createPaymentIntent,
  handleWebhook,
};
