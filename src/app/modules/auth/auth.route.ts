import express, { Request, Response } from "express";
import type { Router } from 'express';
import { authenticate } from "../../middleware/auth";
import { authController } from "./auth.controller";

const router = express.Router();

// Public routes:
router.post("/register", authController.register);   
router.post("/login", authController.login);         



// Protected routes:
router.get("/me", authenticate, authController.getMe);          
router.post("/logout", authenticate, authController.logout);     
router.put("/profile", authenticate, authController.updateProfile); 


export const authRouter: Router = router;
