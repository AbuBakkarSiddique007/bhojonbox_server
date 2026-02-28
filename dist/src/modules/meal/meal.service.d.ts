export declare const mealService: {
    getAllMeals: (query: {
        category?: string;
        provider?: string;
        search?: string;
        minPrice?: string;
        maxPrice?: string;
        page?: string;
        limit?: string;
    }) => Promise<{
        meals: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getMealById: (id: string) => Promise<any>;
    getMealsByProvider: (userId: string) => Promise<any>;
    createMeal: (userId: string, data: {
        name: string;
        description?: string;
        price: number;
        image?: string;
        categoryId: string;
        isAvailable?: boolean;
    }) => Promise<any>;
    updateMeal: (userId: string, mealId: string, data: {
        name?: string;
        description?: string;
        price?: number;
        image?: string;
        categoryId?: string;
        isAvailable?: boolean;
    }) => Promise<any>;
    deleteMeal: (userId: string, mealId: string) => Promise<any>;
};
