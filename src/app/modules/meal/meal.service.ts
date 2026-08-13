import { prisma } from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";
import status from 'http-status';
import AppError from '../../errorHelpers/AppError.js';
import paginationAndSortingHelper from "../../utils/sortingAndPaginationHelpers.js";


const getAllMeals = async (query: {
    category?: string;
    provider?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
}) => {
    const where: Prisma.MealWhereInput = {
        isAvailable: true,
        provider: { user: { isActive: true } },
    };

    if (query.category) where.categoryId = query.category;

    if (query.provider) where.providerId = query.provider;

    if (query.search) where.name = { contains: query.search, mode: "insensitive" };


    if (query.minPrice || query.maxPrice) {
        where.price = {};

        if (query.minPrice) where.price.gte = parseFloat(query.minPrice);

        if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
    }

    const { page, limit, skip, sortBy, sortOrder } = paginationAndSortingHelper(query);


    const [meals, total] = await Promise.all([
        prisma.meal.findMany({
            where,
            include: {
                category: true,
                provider: { select: { id: true, storeName: true, logo: true } },
            },
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
        }),
        prisma.meal.count({ where }),
    ]);


    return {
        meals,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};



const getMealById = async (id: string) => {
    const meal = await prisma.meal.findUnique({
        where: { id },
        include: {
            category: true,
            provider: {
                select: { id: true, storeName: true, logo: true, description: true, cuisine: true },
            },
        },
    });

    return meal;
};



const getMealsByProvider = async (userId: string) => {
    const profile = await prisma.providerProfile.findUnique({
        where: { userId },
    });

    if (!profile) throw new AppError(status.NOT_FOUND, "Provider profile not found");

    const meals = await prisma.meal.findMany({
        where: { providerId: profile.id },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    return meals;
};


const createMeal = async (userId: string, data: {
    name: string;
    description?: string;
    price: number;
    image?: string;
    categoryId: string;
    isAvailable?: boolean;
}) => {
    const profile = await prisma.providerProfile.findUnique({
        where: { userId },
    });

    if (!profile) throw new AppError(status.NOT_FOUND, "Provider profile not found");

    const meal = await prisma.meal.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            image: data.image,
            categoryId: data.categoryId,
            providerId: profile.id,
            isAvailable: data.isAvailable ?? true,
        },
        include: { category: true },
    });

    return meal;
};


const updateMeal = async (userId: string, mealId: string, data: {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    categoryId?: string;
    isAvailable?: boolean;
}) => {
    const profile = await prisma.providerProfile.findUnique({
        where: { userId },
    });

    const meal = await prisma.meal.findUnique({ where: { id: mealId } });

    if (!meal || !profile || meal.providerId !== profile.id) {
        throw new AppError(status.NOT_FOUND, "Meal not found or unauthorized");
    }

    const updated = await prisma.meal.update({
        where: { id: mealId },
        data,
        include: { category: true },
    });

    return updated;
};


const deleteMeal = async (userId: string, mealId: string) => {
    const profile = await prisma.providerProfile.findUnique({
        where: { userId },
    });

    const meal = await prisma.meal.findUnique({ where: { id: mealId } });

    if (!meal || !profile || meal.providerId !== profile.id) {
        throw new AppError(status.NOT_FOUND, "Meal not found or unauthorized");
    }

    const deleted = await prisma.meal.delete({ where: { id: mealId } });
    return deleted;
};


export const mealService = {
    getAllMeals,
    getMealById,
    getMealsByProvider,
    createMeal,
    updateMeal,
    deleteMeal,
};
