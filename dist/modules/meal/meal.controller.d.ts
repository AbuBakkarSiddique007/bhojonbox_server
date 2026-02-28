import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
export declare const mealController: {
    getAllMeals: (req: Request, res: Response) => Promise<void>;
    getMealById: (req: Request, res: Response) => Promise<void>;
    getMyMeals: (req: AuthRequest, res: Response) => Promise<void>;
    createMeal: (req: AuthRequest, res: Response) => Promise<void>;
    updateMeal: (req: AuthRequest, res: Response) => Promise<void>;
    deleteMeal: (req: AuthRequest, res: Response) => Promise<void>;
};
