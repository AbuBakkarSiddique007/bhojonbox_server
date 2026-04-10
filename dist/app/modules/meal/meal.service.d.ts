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
        meals: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image: string | null;
            };
            provider: {
                id: string;
                storeName: string;
                logo: string | null;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            image: string | null;
            price: number;
            isAvailable: boolean;
            categoryId: string;
            providerId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getMealById: (id: string) => Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
        };
        provider: {
            id: string;
            storeName: string;
            description: string | null;
            cuisine: string | null;
            logo: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        image: string | null;
        price: number;
        isAvailable: boolean;
        categoryId: string;
        providerId: string;
    }) | null>;
    getMealsByProvider: (userId: string) => Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        image: string | null;
        price: number;
        isAvailable: boolean;
        categoryId: string;
        providerId: string;
    })[]>;
    createMeal: (userId: string, data: {
        name: string;
        description?: string;
        price: number;
        image?: string;
        categoryId: string;
        isAvailable?: boolean;
    }) => Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        image: string | null;
        price: number;
        isAvailable: boolean;
        categoryId: string;
        providerId: string;
    }>;
    updateMeal: (userId: string, mealId: string, data: {
        name?: string;
        description?: string;
        price?: number;
        image?: string;
        categoryId?: string;
        isAvailable?: boolean;
    }) => Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        image: string | null;
        price: number;
        isAvailable: boolean;
        categoryId: string;
        providerId: string;
    }>;
    deleteMeal: (userId: string, mealId: string) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        image: string | null;
        price: number;
        isAvailable: boolean;
        categoryId: string;
        providerId: string;
    }>;
};
