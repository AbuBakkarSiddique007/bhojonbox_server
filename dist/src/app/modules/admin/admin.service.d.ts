export declare const adminService: {
    getAllUsers: (query: {
        role?: string;
        search?: string;
        page?: string;
        limit?: string;
    }) => Promise<{
        users: {
            role: import("../../../../generated/prisma/enums").Role;
            id: string;
            email: string;
            name: string;
            phone: string | null;
            avatar: string | null;
            isActive: boolean;
            createdAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getUserById: (userId: string) => Promise<{
        role: import("../../../../generated/prisma/enums").Role;
        id: string;
        email: string;
        name: string;
        phone: string | null;
        address: string | null;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
        providerProfile: {
            userId: string;
            id: string;
            phone: string | null;
            address: string | null;
            createdAt: Date;
            updatedAt: Date;
            storeName: string;
            description: string | null;
            cuisine: string | null;
            logo: string | null;
            isOpen: boolean;
        } | null;
        _count: {
            orders: number;
            reviews: number;
        };
    }>;
    toggleUserStatus: (userId: string) => Promise<{
        role: import("../../../../generated/prisma/enums").Role;
        id: string;
        email: string;
        name: string;
        isActive: boolean;
    }>;
    changeUserRole: (userId: string, role: string) => Promise<{
        role: import("../../../../generated/prisma/enums").Role;
        id: string;
        email: string;
        name: string;
    }>;
    getAllOrders: (query: {
        status?: string;
        page?: string;
        limit?: string;
    }) => Promise<{
        orders: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
            provider: {
                id: string;
                storeName: string;
            };
            items: ({
                meal: {
                    id: string;
                    name: string;
                };
            } & {
                id: string;
                price: number;
                quantity: number;
                mealId: string;
                orderId: string;
            })[];
        } & {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            providerId: string;
            status: import("../../../../generated/prisma/enums").OrderStatus;
            totalAmount: number;
            deliveryAddress: string;
            note: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getDashboardStats: () => Promise<{
        users: {
            total: number;
            customers: number;
            providers: number;
        };
        meals: number;
        orders: {
            total: number;
            byStatus: Record<string, number>;
        };
        revenue: number;
        reviews: number;
        recentOrders: ({
            user: {
                name: string;
            };
            provider: {
                storeName: string;
            };
        } & {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            providerId: string;
            status: import("../../../../generated/prisma/enums").OrderStatus;
            totalAmount: number;
            deliveryAddress: string;
            note: string | null;
        })[];
    }>;
};
