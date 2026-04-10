import { prisma } from "../../lib/prisma.js";
import httpStatus from 'http-status';
import AppError from '../../errorHelpers/AppError.js';
import paginationAndSortingHelper from "../../utils/sortingAndPaginationHelpers.js";


const getAllUsers = async (query: {
    role?: string;
    search?: string;
    page?: string;
    limit?: string;
}) => {
    const where: any = {};

    if (query.role) where.role = query.role;

    if (query.search) {
        where.OR = [
            {
                name: {
                    contains: query.search, mode: "insensitive"
                }
            },
            {
                email: {
                    contains: query.search, mode: "insensitive"
                }
            },
        ];
    }

    const { page, limit, skip, sortBy, sortOrder } = paginationAndSortingHelper(query);

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                avatar: true,
                isActive: true,
                createdAt: true,
            },
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
        }),
        prisma.user.count({ where }),
    ]);

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};


const getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            avatar: true,
            isActive: true,
            createdAt: true,
            providerProfile: true,
            _count: {
                select: {
                    orders: true,
                    reviews: true,
                },
            },
        },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    return user;
};


const toggleUserStatus = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.role === "ADMIN") {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot suspend an admin");
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { isActive: !user.isActive },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
        },
    });

    return updated;
};


const changeUserRole = async (userId: string, role: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.role === "ADMIN") {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot change admin role");
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { role: role as any },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    return updated;
};


const getAllOrders = async (query: {
    status?: string;
    page?: string;
    limit?: string;
}) => {
    const where: any = {};

    if (query.status) where.status = query.status;

    const { page, limit, skip, sortBy, sortOrder } = paginationAndSortingHelper(query);

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
                provider: { select: { id: true, storeName: true } },
                items: { include: { meal: { select: { id: true, name: true } } } },
            },
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
        }),
        prisma.order.count({ where }),
    ]);

    return {
        orders,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};


const getDashboardStats = async () => {
    const [
        totalUsers,
        totalCustomers,
        totalProviders,
        totalMeals,
        totalOrders,
        totalRevenue,
        totalReviews,
        ordersByStatus,
        recentOrders,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.user.count({ where: { role: "PROVIDER" } }),
        prisma.meal.count(),
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: "DELIVERED" } }),
        prisma.review.count(),
        prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { name: true } },
                provider: { select: { storeName: true } },
            },
        }),
    ]);

    const stats = {
        users: {
            total: totalUsers,
            customers: totalCustomers,
            providers: totalProviders,
        },
        meals: totalMeals,
        orders: {
            total: totalOrders,
            byStatus: ordersByStatus.reduce((acc: Record<string, number>, item: { status: string; _count: { _all: number } }) => {
                    acc[item.status] = item._count._all;
                    return acc;
                }, {}),
        },
        revenue: totalRevenue._sum.totalAmount || 0,
        reviews: totalReviews,
        recentOrders,
    };

    return stats;
};


export const adminService = {
    getAllUsers,
    getUserById,
    toggleUserStatus,
    changeUserRole,
    getAllOrders,
    getDashboardStats,
};
