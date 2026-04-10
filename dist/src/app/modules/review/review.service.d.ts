export declare const reviewService: {
    createReview: (userId: string, data: {
        mealId: string;
        orderId: string;
        rating: number;
        comment?: string;
    }) => Promise<{
        user: {
            id: string;
            name: string;
            avatar: string | null;
        };
        meal: {
            id: string;
            name: string;
        };
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mealId: string;
        rating: number;
        comment: string | null;
        orderId: string;
    }>;
    getReviewsByMeal: (mealId: string) => Promise<{
        reviews: ({
            user: {
                id: string;
                name: string;
                avatar: string | null;
            };
        } & {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            mealId: string;
            rating: number;
            comment: string | null;
            orderId: string;
        })[];
        averageRating: number;
        totalRatings: number;
    }>;
    getReviewById: (reviewId: string) => Promise<({
        user: {
            id: string;
            name: string;
            avatar: string | null;
        };
        meal: {
            id: string;
            name: string;
        };
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mealId: string;
        rating: number;
        comment: string | null;
        orderId: string;
    }) | null>;
    getMyReviews: (userId: string) => Promise<({
        meal: {
            id: string;
            name: string;
            image: string | null;
        };
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mealId: string;
        rating: number;
        comment: string | null;
        orderId: string;
    })[]>;
    updateReview: (userId: string, reviewId: string, data: {
        rating?: number;
        comment?: string;
    }) => Promise<{
        user: {
            id: string;
            name: string;
            avatar: string | null;
        };
        meal: {
            id: string;
            name: string;
            image: string | null;
        };
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mealId: string;
        rating: number;
        comment: string | null;
        orderId: string;
    }>;
    deleteReview: (userId: string, reviewId: string, role: string) => Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mealId: string;
        rating: number;
        comment: string | null;
        orderId: string;
    }>;
};
