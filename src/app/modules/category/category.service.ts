import { prisma } from "../../lib/prisma";


const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });
    
    return categories;
};


const getCategoryById = async (id: string) => {
    const category = await prisma.category.findUnique({ where: { id } });
    return category;
};


const createCategory = async (data: { name: string; image?: string }) => {
    const category = await prisma.category.create({ data });
    return category;
};


const updateCategory = async (id: string, data: { name?: string; image?: string }) => {
    const category = await prisma.category.update({ where: { id }, data });
    return category;
};


const deleteCategory = async (id: string) => {
    const category = await prisma.category.delete({ where: { id } });
    return category;
};

export const categoryService = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
