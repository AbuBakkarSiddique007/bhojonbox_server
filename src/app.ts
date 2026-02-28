import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.route.js";
import { providerRouter } from "./modules/provider/provider.route.js";
import { categoryRouter } from "./modules/category/category.route.js";
import { mealRouter } from "./modules/meal/meal.route.js";
import { orderRouter } from "./modules/order/order.route.js";
import { reviewRouter } from "./modules/review/review.route.js";
import { adminRouter } from "./modules/admin/admin.route.js";
import { notFound } from "./middleware/notFound.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";

const app: Application = express();

const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (FRONTEND_URL) {
      if (origin === FRONTEND_URL) return callback(null, true);
      return callback(new Error("CORS policy: This origin is not allowed."));
    }
    return callback(null, true);
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 204,
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

// Lightweight health endpoint for platform probes
app.get("/healthz", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: !!process.env.DATABASE_URL,
  });
});



// Error handling for unknown routes:
app.use(notFound);

// Global error handler:
app.use(globalErrorHandler);

export default app;