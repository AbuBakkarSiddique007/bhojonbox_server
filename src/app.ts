import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes


// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Welcome to BhoJonBox Server!",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default app;