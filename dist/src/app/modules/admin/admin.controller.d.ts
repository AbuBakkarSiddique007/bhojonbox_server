import { Request, Response } from "express";
export declare const adminController: {
    getAllUsers: (req: Request, res: Response) => Promise<void>;
    getUserById: (req: Request, res: Response) => Promise<void>;
    toggleUserStatus: (req: Request, res: Response) => Promise<void>;
    changeUserRole: (req: Request, res: Response) => Promise<void>;
    getAllOrders: (req: Request, res: Response) => Promise<void>;
    getDashboardStats: (req: Request, res: Response) => Promise<void>;
};
