export declare const adminService: {
    getAllUsers: (query: {
        role?: string;
        search?: string;
        page?: string;
        limit?: string;
    }) => Promise<{
        users: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getUserById: (userId: string) => Promise<any>;
    toggleUserStatus: (userId: string) => Promise<any>;
    changeUserRole: (userId: string, role: string) => Promise<any>;
    getAllOrders: (query: {
        status?: string;
        page?: string;
        limit?: string;
    }) => Promise<{
        orders: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getDashboardStats: () => Promise<{
        users: {
            total: any;
            customers: any;
            providers: any;
        };
        meals: any;
        orders: {
            total: any;
            byStatus: any;
        };
        revenue: any;
        reviews: any;
        recentOrders: any;
    }>;
};
