import { Request, Response } from "express";
import { categoryService } from "./category.service.js";
import { sendResponse, handleError } from "../../utils/sendResponse.js";


const getAllCategories = async (_req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories();
        sendResponse(res, {
            message: "Categories fetched successfully",
            data: { categories },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch all categories");
    }
};


const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id as string);
        if (!category) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Category not found",
            });
        }
        sendResponse(res, {
            message: "Category fetched successfully",
            data: { category },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch single category");
    }
};


const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, image } = req.body;
        if (!name) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Category name is required",
            });
        }

        const category = await categoryService.createCategory({ name, image });

        sendResponse(res, {
            statusCode: 201,
            message: "Category created successfully",
            data: { category },
        });
    } catch (err: any) {
        if (err.code === "P2002") {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Category already exists",
            });
        }
        handleError(res, err, "Failed to create category");
    }
};


const updateCategory = async (req: Request, res: Response) => {
    try {
        const { name, image } = req.body;
        const category = await categoryService.updateCategory(req.params.id as string, { name, image });

        sendResponse(res, {
            message: "Category updated successfully",
            data: { category },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to update category");
    }
};


const deleteCategory = async (req: Request, res: Response) => {
    try {
        await categoryService.deleteCategory(req.params.id as string);

        sendResponse(res, {
            message: "Category deleted successfully",
        });
    } catch (err: any) {
        handleError(res, err, "Failed to delete category");
    }
};


export const categoryController = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
