import { OrderStatus } from "../../../../generated/prisma/enums.js";
export declare const orderService: {
    createOrder: (userId: string, data: {
        providerId: string;
        deliveryAddress: string;
        note?: string;
        items: {
            mealId: string;
            quantity: number;
        }[];
    }) => Promise<{
        provider: {
            id: string;
            storeName: string;
            logo: string | null;
        };
        items: ({
            meal: {
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
        status: OrderStatus;
        totalAmount: number;
        deliveryAddress: string;
        note: string | null;
    }>;
    getMyOrders: (userId: string) => Promise<({
        provider: {
            id: string;
            storeName: string;
            logo: string | null;
        };
        items: ({
            meal: {
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
        status: OrderStatus;
        totalAmount: number;
        deliveryAddress: string;
        note: string | null;
    })[]>;
    getOrderById: (orderId: string, userId: string, role: string) => Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            address: string | null;
        };
        provider: {
            id: string;
            storeName: string;
            logo: string | null;
        };
        items: ({
            meal: {
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
        status: OrderStatus;
        totalAmount: number;
        deliveryAddress: string;
        note: string | null;
    }>;
    getProviderOrders: (userId: string, status?: string) => Promise<({
        user: {
            id: string;
            name: string;
            phone: string | null;
            address: string | null;
        };
        items: ({
            meal: {
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
        status: OrderStatus;
        totalAmount: number;
        deliveryAddress: string;
        note: string | null;
    })[]>;
    updateOrderStatus: (userId: string, orderId: string, status: OrderStatus) => Promise<{
        user: {
            id: string;
            name: string;
            phone: string | null;
        };
        items: ({
            meal: {
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
        status: OrderStatus;
        totalAmount: number;
        deliveryAddress: string;
        note: string | null;
    }>;
    cancelOrder: (userId: string, orderId: string) => Promise<{
        provider: {
            id: string;
            storeName: string;
        };
        items: ({
            meal: {
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
        status: OrderStatus;
        totalAmount: number;
        deliveryAddress: string;
        note: string | null;
    }>;
};
