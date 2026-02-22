import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { adminService } from "./admin.service.js";


const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await adminService.getAllUsers({
            role: req.query.role as string,
            search: req.query.search as string,
            page: req.query.page as string,
            limit: req.query.limit as string,
        });

        res.status(200).json(result);

    } catch (err: any) {
        res.status(500).json({
            message: "Failed to fetch all users",
            error: err.message,
        });
    }
};


const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await adminService.getUserById(req.params.id as string);

        res.status(200).json({ user });

    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({
                message: err.message
            });

            return;
        }
        res.status(500).json({
            message: "Failed to fetch user by ID",
            error: err.message,
        });
    }
};


const toggleUserStatus = async (req: Request, res: Response) => {
    try {
        const user = await adminService.toggleUserStatus(req.params.id as string);

        res.status(200).json({
            user,
            message: user.isActive ? "User activated" : "User suspended",
        });
    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({
                message: err.message
            });

            return;
        }
        res.status(500).json({
            message: "Failed to toggle user status",
            error: err.message,
        });
    }
};


const changeUserRole = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;

        if (!role || !["CUSTOMER", "PROVIDER"].includes(role)) {
            res.status(400).json({
                message: "Valid role is required (CUSTOMER or PROVIDER)",
            });
            return;
        }

        const user = await adminService.changeUserRole(req.params.id as string, role);

        res.status(200).json({
            user,
            message: `Role changed to ${role}`
        });

    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({
                message: err.message
            });

            return;
        }
        res.status(500).json({
            message: "Failed to change user role",
            error: err.message,
        });
    }
};


const getAllOrders = async (req: Request, res: Response) => {
    try {
        const result = await adminService.getAllOrders({
            status: req.query.status as string,
            page: req.query.page as string,
            limit: req.query.limit as string,
        });

        res.status(200).json(result);
    } catch (err: any) {
        res.status(500).json({
            message: "Failed to fetch all orders",
            error: err.message,
        });
    }
};


const getDashboardStats = async (_req: Request, res: Response) => {
    try {
        const stats = await adminService.getDashboardStats();

        res.status(200).json({ stats });
    } catch (err: any) {
        res.status(500).json({
            message: "Failed to fetch dashboard stats",
            error: err.message,
        });
    }
};


export const adminController = {
    getAllUsers,
    getUserById,
    toggleUserStatus,
    changeUserRole,
    getAllOrders,
    getDashboardStats,
};
