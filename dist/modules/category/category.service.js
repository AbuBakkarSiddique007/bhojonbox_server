import { prisma } from "../../lib/prisma";
const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });
    return categories;
};
const getCategoryById = async (id) => {
    const category = await prisma.category.findUnique({ where: { id } });
    return category;
};
const createCategory = async (data) => {
    const category = await prisma.category.create({ data });
    return category;
};
const updateCategory = async (id, data) => {
    const category = await prisma.category.update({ where: { id }, data });
    return category;
};
const deleteCategory = async (id) => {
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
//# sourceMappingURL=category.service.js.map