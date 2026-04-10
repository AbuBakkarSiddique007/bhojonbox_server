import { Request, Response } from "express";
import status from 'http-status';
import { AuthRequest } from "../../middleware/auth";
import { mealService } from "./meal.service";
import { sendResponse, handleError } from "../../utils/sendResponse";  


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

        sendResponse(res, {
            message: "Meals fetched successfully",
            data: result,
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch all meals");
    }
};



const getMealById = async (req: Request, res: Response) => {
    try {
        const meal = await mealService.getMealById(req.params.id as string);

        if (!meal) {
            return sendResponse(res, {
                statusCode: status.NOT_FOUND,
                success: false,
                message: "Meal not found",
            });
        }

        sendResponse(res, {
            message: "Meal fetched successfully",
            data: { meal },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch meal by ID");
    }
};



const getMyMeals = async (req: AuthRequest, res: Response) => {
    try {
        const meals = await mealService.getMealsByProvider(req.user!.id);

        sendResponse(res, {
            message: "Provider meals fetched successfully",
            data: { meals },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch provider meals");
    }
};



const createMeal = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, price, image, categoryId, isAvailable } = req.body;

        if (!name || !price || !categoryId) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "Name, price and categoryId are required",
            });
        }

        const meal = await mealService.createMeal(req.user!.id, {
            name,
            description,
            price: parseFloat(price),
            image,
            categoryId,
            isAvailable,
        });

        sendResponse(res, {
            statusCode: status.CREATED,
            message: "Meal created successfully",
            data: { meal },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to create meal");
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

        sendResponse(res, {
            message: "Meal updated successfully",
            data: { meal },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to update meal");
    }
};



const deleteMeal = async (req: AuthRequest, res: Response) => {
    try {
        await mealService.deleteMeal(req.user!.id, req.params.id as string);

        sendResponse(res, {
            message: "Meal deleted successfully",
        });
    } catch (err: any) {
        handleError(res, err, "Failed to delete meal");
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