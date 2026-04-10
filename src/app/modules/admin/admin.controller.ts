import { Request, Response } from "express";
import status from 'http-status';
import { AuthRequest } from "../../middleware/auth.js";
import { adminService } from "./admin.service.js";
import { sendResponse, handleError } from "../../utils/sendResponse.js";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await adminService.getAllUsers({
            role: req.query.role as string,
            search: req.query.search as string,
            page: req.query.page as string,
            limit: req.query.limit as string,
        });

        sendResponse(res, {
            message: "Users fetched successfully",
            data: result,
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch all users");
    }
};

const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await adminService.getUserById(req.params.id as string);

        sendResponse(res, {
            message: "User fetched successfully",
            data: { user },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch user by ID");
    }
};

const toggleUserStatus = async (req: Request, res: Response) => {
    try {
        const user = await adminService.toggleUserStatus(req.params.id as string);

        sendResponse(res, {
            message: user.isActive ? "User activated" : "User suspended",
            data: { user },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to toggle user status");
    }
};

const changeUserRole = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;

        if (!role || !["CUSTOMER", "PROVIDER"].includes(role)) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "Valid role is required (CUSTOMER or PROVIDER)",
            });
        }

        const user = await adminService.changeUserRole(req.params.id as string, role);

        sendResponse(res, {
            message: `Role changed to ${role}`,
            data: { user },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to change user role");
    }
};

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const result = await adminService.getAllOrders({
            status: req.query.status as string,
            page: req.query.page as string,
            limit: req.query.limit as string,
        });

        sendResponse(res, {
            message: "Orders fetched successfully",
            data: result,
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch all orders");
    }
};

const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const stats = await adminService.getDashboardStats();

        sendResponse(res, {
            message: "Dashboard stats fetched successfully",
            data: { stats },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch dashboard stats");
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
