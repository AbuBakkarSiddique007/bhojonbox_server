import { OrderStatus } from "../../../generated/prisma/enums.js";
export declare const orderService: {
    createOrder: (userId: string, data: {
        providerId: string;
        deliveryAddress: string;
        note?: string;
        items: {
            mealId: string;
            quantity: number;
        }[];
    }) => Promise<any>;
    getMyOrders: (userId: string) => Promise<any>;
    getOrderById: (orderId: string, userId: string, role: string) => Promise<any>;
    getProviderOrders: (userId: string, status?: string) => Promise<any>;
    updateOrderStatus: (userId: string, orderId: string, status: OrderStatus) => Promise<any>;
    cancelOrder: (userId: string, orderId: string) => Promise<any>;
};
