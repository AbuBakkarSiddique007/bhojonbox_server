import { prisma } from "../../lib/prisma.js";
import httpStatus from 'http-status';
import AppError from '../../errorHelpers/AppError.js';
import { OrderStatus } from "../../../generated/prisma/enums.js";
const createOrder = async (userId, data) => {
    // 1. Verify all meals exist and belong to the same provider:
    const meals = await prisma.meal.findMany({
        where: {
            id: { in: data.items.map((i) => i.mealId) },
            providerId: data.providerId,
            isAvailable: true,
        },
    });
    if (meals.length !== data.items.length) {
        throw new AppError(httpStatus.BAD_REQUEST, "Some meals are invalid or unavailable");
    }
    // 2. Calculate total amount based on meal prices and quantities:
    const totalAmount = data.items.reduce((sum, item) => {
        const meal = meals.find((m) => m.id === item.mealId);
        return sum + (meal.price * item.quantity);
    }, 0);
    const order = await prisma.order.create({
        data: {
            userId,
            providerId: data.providerId,
            deliveryAddress: data.deliveryAddress,
            note: data.note,
            totalAmount,
            items: {
                create: data.items.map((item) => {
                    const meal = meals.find((m) => m.id === item.mealId);
                    return {
                        mealId: item.mealId,
                        quantity: item.quantity,
                        price: meal.price,
                    };
                }),
            },
        },
        include: {
            items: {
                include: {
                    meal: true
                }
            },
            provider: {
                select: {
                    id: true,
                    storeName: true,
                    logo: true,
                }
            },
        },
    });
    return order;
};
const getMyOrders = async (userId) => {
    const orders = await prisma.order.findMany({
        where: { userId },
        include: {
            items: {
                include: {
                    meal: true
                }
            },
            provider: {
                select: {
                    id: true,
                    storeName: true,
                    logo: true
                }
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return orders;
};
const getOrderById = async (orderId, userId, role) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    meal: true
                }
            },
            provider: {
                select: {
                    id: true,
                    storeName: true,
                    logo: true
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true
                }
            },
        },
    });
    if (!order)
        throw new AppError(httpStatus.NOT_FOUND, "Order not found");
    // Only allow: the customer who placed it, the provider who received it, or admin:
    if (role === "ADMIN")
        return order;
    if (role === "CUSTOMER" && order.userId === userId)
        return order;
    if (role === "PROVIDER") {
        const profile = await prisma.providerProfile.findUnique({ where: { userId } });
        if (profile && order.providerId === profile.id)
            return order;
    }
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to view this order");
};
const getProviderOrders = async (userId, status) => {
    const profile = await prisma.providerProfile.findUnique({
        where: { userId },
    });
    if (!profile)
        throw new AppError(httpStatus.NOT_FOUND, "Provider profile not found");
    const where = { providerId: profile.id };
    if (status)
        where.status = status;
    const orders = await prisma.order.findMany({
        where,
        include: {
            items: {
                include: {
                    meal: true
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    address: true
                }
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return orders;
};
const updateOrderStatus = async (userId, orderId, status) => {
    const profile = await prisma.providerProfile.findUnique({
        where: {
            userId
        },
    });
    if (!profile) {
        throw new AppError(httpStatus.NOT_FOUND, "Provider profile not found");
    }
    const order = await prisma.order.findUnique({
        where: {
            id: orderId
        }
    });
    if (!order || order.providerId !== profile.id) {
        throw new AppError(httpStatus.NOT_FOUND, "Order not found or unauthorized");
    }
    // Validate status transitions:
    const validTransitions = {
        PLACED: ["PREPARING", "CANCELLED"],
        PREPARING: ["READY"],
        READY: ["DELIVERED"],
    };
    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(status)) {
        throw new AppError(httpStatus.BAD_REQUEST, `Cannot change status from ${order.status} to ${status}`);
    }
    const updated = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: {
            items: { include: { meal: true } },
            user: { select: { id: true, name: true, phone: true } },
        },
    });
    return updated;
};
const cancelOrder = async (userId, orderId) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== userId) {
        throw new AppError(httpStatus.NOT_FOUND, "Order not found");
    }
    if (order.status !== "PLACED") {
        throw new AppError(httpStatus.BAD_REQUEST, "Can only cancel orders that are still PLACED");
    }
    const cancelled = await prisma.order.update({
        where: {
            id: orderId
        },
        data: {
            status: OrderStatus.CANCELLED
        },
        include: {
            items: {
                include: {
                    meal: true
                }
            },
            provider: {
                select: {
                    id: true,
                    storeName: true
                }
            },
        },
    });
    return cancelled;
};
export const orderService = {
    createOrder,
    getMyOrders,
    getOrderById,
    getProviderOrders,
    updateOrderStatus,
    cancelOrder,
};
//# sourceMappingURL=order.service.js.map