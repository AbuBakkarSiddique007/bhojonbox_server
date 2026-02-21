import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.route";
import { providerRouter } from "./modules/provider/provider.route";
import { categoryRouter } from "./modules/category/category.route";
import { mealRouter } from "./modules/meal/meal.route";

const app: Application = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5000",
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



// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Welcome to BhoJonBox Server!",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default app;