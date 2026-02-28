import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";


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
        throw {
            status: 404,
            message: "Order not found"
        };
    }

    if (order.status !== "DELIVERED") {
        throw {
            status: 400,
            message: "Can only review delivered orders"
        };
    }


    // Verify the meal was part of this order:
    const mealInOrder = order.items.some((item: any) => item.mealId === data.mealId);


    if (!mealInOrder) {
        throw {
            status: 400,
            message: "This meal was not part of the order"
        };
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
        throw {
            status: 400,
            message: "You already reviewed this meal for this order"
        };
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
        throw { status: 404, message: "Review not found or unauthorized" };
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
        throw {
            status: 404,
            message: "Review not found"
        };
    }


    // Only the review owner or admin can delete:
    if (review.userId !== userId && role !== Role.ADMIN) {
        throw {
            status: 403,
            message: "Not authorized to delete this review"
        };
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
