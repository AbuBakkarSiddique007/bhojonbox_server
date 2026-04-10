import status from 'http-status';
import { mealService } from "./meal.service.js";
import { sendResponse, handleError } from "../../utils/sendResponse.js";
const getAllMeals = async (req, res) => {
    try {
        const result = await mealService.getAllMeals({
            category: req.query.category,
            provider: req.query.provider,
            search: req.query.search,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            page: req.query.page,
            limit: req.query.limit,
        });
        sendResponse(res, {
            message: "Meals fetched successfully",
            data: result,
        });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch all meals");
    }
};
const getMealById = async (req, res) => {
    try {
        const meal = await mealService.getMealById(req.params.id);
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
    }
    catch (err) {
        handleError(res, err, "Failed to fetch meal by ID");
    }
};
const getMyMeals = async (req, res) => {
    try {
        const meals = await mealService.getMealsByProvider(req.user.id);
        sendResponse(res, {
            message: "Provider meals fetched successfully",
            data: { meals },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch provider meals");
    }
};
const createMeal = async (req, res) => {
    try {
        const { name, description, price, image, categoryId, isAvailable } = req.body;
        if (!name || !price || !categoryId) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "Name, price and categoryId are required",
            });
        }
        const meal = await mealService.createMeal(req.user.id, {
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
    }
    catch (err) {
        handleError(res, err, "Failed to create meal");
    }
};
const updateMeal = async (req, res) => {
    try {
        const { name, description, price, image, categoryId, isAvailable } = req.body;
        const meal = await mealService.updateMeal(req.user.id, req.params.id, {
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
    }
    catch (err) {
        handleError(res, err, "Failed to update meal");
    }
};
const deleteMeal = async (req, res) => {
    try {
        await mealService.deleteMeal(req.user.id, req.params.id);
        sendResponse(res, {
            message: "Meal deleted successfully",
        });
    }
    catch (err) {
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
//# sourceMappingURL=meal.controller.js.map