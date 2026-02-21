import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { mealService } from "./meal.service.js";


const getAllMeals = async (req: Request, res: Response) => {
    try {
        const result = await mealService.getAllMeals({
            category: req.query.category as string,
            provider: req.query.provider as string,
            search: req.query.search as string,
            minPrice: req.query.minPrice as string,
            maxPrice: req.query.maxPrice as string,
            page: req.query.page as string,
            limit: req.query.limit as string,
        });

        res.status(200).json(result);

    } catch (err: any) {
        res.status(500).json({
            message: "Failed to all fetch meals",
            error: err.message,
        });
    }
};



const getMealById = async (req: Request, res: Response) => {
    try {
        const meal = await mealService.getMealById(req.params.id as string);

        if (!meal) {
            res.status(404).json({
                message: "Meal not found"
            });

            return;
        }

        res.status(200).json({ meal });

    } catch (err: any) {
        res.status(500).json({
            message: "Failed to fetch meal by ID",
            error: err.message,
        });
    }
};



const getMyMeals = async (req: AuthRequest, res: Response) => {
    try {
        const meals = await mealService.getMealsByProvider(req.user!.id);

        res.status(200).json({ meals });

    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({ 
                message: err.message 
            });

            return;
        }
        res.status(500).json({
            message: "Failed to fetch provider meals",
            error: err.message,
        });
    }
};



const createMeal = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, price, image, categoryId, isAvailable } = req.body;

        if (!name || !price || !categoryId) {
            res.status(400).json({
                message: "Name, price and categoryId are required",
            });
            return;
        }

        const meal = await mealService.createMeal(req.user!.id, {
            name,
            description,
            price: parseFloat(price),
            image,
            categoryId,
            isAvailable,
        });

        res.status(201).json({ meal });
    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
            return;
        }
        res.status(500).json({
            message: "Failed to create meal",
            error: err.message,
        });
    }
};



const updateMeal = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, price, image, categoryId, isAvailable } = req.body;

        const meal = await mealService.updateMeal(req.user!.id, req.params.id as string, {
            name,
            description,
            price: price ? parseFloat(price) : undefined,
            image,
            categoryId,
            isAvailable,
        });

        res.json({ meal });
    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
            return;
        }
        res.status(500).json({
            message: "Failed to update meal",
            error: err.message,
        });
    }
};



const deleteMeal = async (req: AuthRequest, res: Response) => {
    try {
        await mealService.deleteMeal(req.user!.id, req.params.id as string);
        res.status(200).json({ 
            message: "Meal deleted" 
        });

    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({ 
                message: err.message 
            });

            return;
        }
        res.status(500).json({
            message: "Failed to delete meal",
            error: err.message,
        });
    }
};


export const mealController = {
    getAllMeals,
    getMealById,
    getMyMeals,
    createMeal,
    updateMeal,
    deleteMeal,
};