import { Request, Response } from "express";
import { categoryService } from "./category.service.js";


const getAllCategories = async (_req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json({ categories });
    } catch (err: any) {
        res.status(500).json({ 
            message: "Failed to fetch all categories",
            error: err.message
        });
    }
};


const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id as string);
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.json({ category });
    } catch (err: any) {
        res.status(500).json({ 
            message: "Failed to fetch single category",
            error: err.message
        });
    }
};


const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, image } = req.body;
        if (!name) {
            res.status(400).json({ 
                message: "Category name is required",
                error: "Name is required"
            });
            return;
        }

        const category = await categoryService.createCategory({ name, image });
        
        res.status(201).json({ category });

    } catch (err: any) {
        if (err.code === "P2002") {
            res.status(400).json({ 
                message: "Category already exists",
                error: err.message
            });
            return;
        }
        
        res.status(500).json({ 
            message: "Failed to create category",
            error: err.message
        });
    }
};


const updateCategory = async (req: Request, res: Response) => {
    try {
        const { name, image } = req.body;
        const category = await categoryService.updateCategory(req.params.id as string, { name, image });

        res.json({ category });

    } catch (err: any) {
        res.status(500).json({ 
            message: "Failed to update category",
            error: err.message
        });
    }
};


const deleteCategory = async (req: Request, res: Response) => {
    try {
        await categoryService.deleteCategory(req.params.id as string);

        res.json({ 
            message: "Category deleted" 
        });

    } catch (err: any) {
        res.status(500).json({ 
            message: "Failed to delete category",
            error: err.message
        });
    }
};


export const categoryController = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
