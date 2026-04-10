import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const orderController: {
    createOrder: (req: AuthRequest, res: Response) => Promise<void>;
    getMyOrders: (req: AuthRequest, res: Response) => Promise<void>;
    getOrderById: (req: AuthRequest, res: Response) => Promise<void>;
    getProviderOrders: (req: AuthRequest, res: Response) => Promise<void>;
    updateOrderStatus: (req: AuthRequest, res: Response) => Promise<void>;
    cancelOrder: (req: AuthRequest, res: Response) => Promise<void>;
};
