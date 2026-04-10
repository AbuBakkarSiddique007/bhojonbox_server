import status from 'http-status';
import { categoryService } from "./category.service.js";
import { sendResponse, handleError } from "../../utils/sendResponse";
const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        sendResponse(res, {
            message: "Categories fetched successfully",
            data: { categories },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch all categories");
    }
};
const getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) {
            return sendResponse(res, {
                statusCode: status.NOT_FOUND,
                success: false,
                message: "Category not found",
            });
        }
        sendResponse(res, {
            message: "Category fetched successfully",
            data: { category },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch single category");
    }
};
const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        if (!name) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "Category name is required",
            });
        }
        const category = await categoryService.createCategory({ name, image });
        sendResponse(res, {
            statusCode: status.CREATED,
            message: "Category created successfully",
            data: { category },
        });
    }
    catch (err) {
        if (err.code === "P2002") {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "Category already exists",
            });
        }
        handleError(res, err, "Failed to create category");
    }
};
const updateCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        const category = await categoryService.updateCategory(req.params.id, { name, image });
        sendResponse(res, {
            message: "Category updated successfully",
            data: { category },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to update category");
    }
};
const deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        sendResponse(res, {
            message: "Category deleted successfully",
        });
    }
    catch (err) {
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
//# sourceMappingURL=category.controller.js.map