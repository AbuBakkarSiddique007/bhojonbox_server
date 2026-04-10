import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env.js";
import { authRouter } from "./app/modules/auth/auth.route.js";
import { providerRouter } from "./app/modules/provider/provider.route.js";
import { categoryRouter } from "./app/modules/category/category.route.js";
import { mealRouter } from "./app/modules/meal/meal.route.js";
import { orderRouter } from "./app/modules/order/order.route.js";
import { reviewRouter } from "./app/modules/review/review.route.js";
import { adminRouter } from "./app/modules/admin/admin.route.js";
import { notFound } from "./app/middleware/notFound.js";
import globalErrorHandler from "./app/middleware/globalErrorHandler.js";
const app = express();
app.use(cors({
    origin: [
        envVars.FRONTEND_URL,
        envVars.BASE_URL,
        "http://localhost:3000",
        "http://localhost:5000",
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to BhoJonBox Server!",
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});
app.get("/healthz", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: !!envVars.DATABASE_URL,
    });
});
// Error handling for unknown routes:
app.use(notFound);
// Global error handler:
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map