import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.route";
import { providerRouter } from "./modules/provider/provider.route";
import { categoryRouter } from "./modules/category/category.route";
import { mealRouter } from "./modules/meal/meal.route";
import { orderRouter } from "./modules/order/order.route";
import { reviewRouter } from "./modules/review/review.route";
import { adminRouter } from "./modules/admin/admin.route";
import { notFound } from "./middleware/notFound";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

// Middleware:
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Auth routes
app.use("/api/auth", authRouter);

// Provider routes
app.use("/api/providers", providerRouter);

// Category routes
app.use("/api/categories", categoryRouter);


// Meal routes
app.use("/api/meals", mealRouter);

// Order routes
app.use("/api/orders", orderRouter);

// Review routes
app.use("/api/reviews", reviewRouter);

// Admin routes
app.use("/api/admin", adminRouter);


// Health check :
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to BhoJonBox Server!",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});



// Error handling for unknown routes:
app.use(notFound);

// Global error handler:
app.use(globalErrorHandler);

export default app;