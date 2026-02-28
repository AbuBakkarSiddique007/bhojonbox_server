export declare const reviewService: {
    createReview: (userId: string, data: {
        mealId: string;
        orderId: string;
        rating: number;
        comment?: string;
    }) => Promise<any>;
    getReviewsByMeal: (mealId: string) => Promise<{
        reviews: any;
        averageRating: number;
        totalRatings: any;
    }>;
    getReviewById: (reviewId: string) => Promise<any>;
    getMyReviews: (userId: string) => Promise<any>;
    updateReview: (userId: string, reviewId: string, data: {
        rating?: number;
        comment?: string;
    }) => Promise<any>;
    deleteReview: (userId: string, reviewId: string, role: string) => Promise<any>;
};
