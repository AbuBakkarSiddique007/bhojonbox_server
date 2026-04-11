import { Role } from "@prisma/client";
import status from 'http-status';
import AppError from '../../errorHelpers/AppError.js';
import { prisma } from "../../lib/prisma.js";


const createReview = async (userId: string, data: {
    mealId: string;
    orderId: string;
    rating: number;
    comment?: string;
}) => {

    // Verify the order exists, belongs to this user, and is DELIVERED:

    const order = await prisma.order.findUnique({
        where: {
            id: data.orderId
        },

        include: {
            items: true
        },

    });


    if (!order || order.userId !== userId) {
        throw new AppError(status.NOT_FOUND, "Order not found");
    }

    if (order.status !== "DELIVERED") {
        throw new AppError(status.BAD_REQUEST, "Can only review delivered orders");
    }


    // Verify the meal was part of this order:
    const mealInOrder = order.items.some((item: any) => item.mealId === data.mealId);


    if (!mealInOrder) {
        throw new AppError(status.BAD_REQUEST, "This meal was not part of the order");
    }

    // Check if already reviewed:
    const existing = await prisma.review.findUnique({
        where: {
            userId_mealId_orderId: {
                userId,
                mealId: data.mealId,
                orderId: data.orderId,
            },
        },
    });

    if (existing) {
        throw new AppError(status.BAD_REQUEST, "You already reviewed this meal for this order");
    }

    const review = await prisma.review.create({
        data: {
            userId,
            mealId: data.mealId,
            orderId: data.orderId,
            rating: data.rating,
            comment: data.comment,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            },
            meal: {
                select: {
                    id: true,
                    name: true
                }
            },
        },
    });

    return review;
};


const getReviewsByMeal = async (mealId: string) => {
    const reviews = await prisma.review.findMany({
        where: { mealId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            },
        },

        orderBy: { createdAt: "desc" },
    });

    // Calculate average rating:
    const totalRatings = reviews.length;
    const averageRating = totalRatings > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalRatings
        : 0;

    return {
        reviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
    };
};


const getReviewById = async (reviewId: string) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            },
            meal: {
                select: {
                    id: true,
                    name: true
                }
            },
        },
    });

    return review;
};


const getMyReviews = async (userId: string) => {
    const reviews = await prisma.review.findMany({
        where: { userId },
        include: {
            meal: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
        },
        orderBy: {
            createdAt: "desc"
        },
    });

    return reviews;
};


const updateReview = async (userId: string, reviewId: string, data: {
    rating?: number;
    comment?: string;
}) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review || review.userId !== userId) {
        throw new AppError(status.NOT_FOUND, "Review not found or unauthorized");
    }

    const updated = await prisma.review.update({
        where: { id: reviewId },
        data,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            },

            meal: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
        },
    });

    return updated;
};


const deleteReview = async (userId: string, reviewId: string, role: string) => {
    const review = await prisma.review.findUnique({
        where: {
            id: reviewId
        }
    });

    if (!review) {
        throw new AppError(status.NOT_FOUND, "Review not found");
    }


    // Only the review owner or admin can delete:
    if (review.userId !== userId && role !== Role.ADMIN) {
        throw new AppError(status.FORBIDDEN, "Not authorized to delete this review");
    }

    const deleted = await prisma.review.delete({
        where: {
            id: reviewId
        }
    });

    return deleted;
};


export const reviewService = {
    createReview,
    getReviewsByMeal,
    getReviewById,
    getMyReviews,
    updateReview,
    deleteReview,
};
