import status from 'http-status';
import { adminService } from "./admin.service.js";
import { sendResponse, handleError } from "../../utils/sendResponse.js";
const getAllUsers = async (req, res) => {
    try {
        const result = await adminService.getAllUsers({
            role: req.query.role,
            search: req.query.search,
            page: req.query.page,
            limit: req.query.limit,
        });
        sendResponse(res, {
            message: "Users fetched successfully",
            data: result,
        });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch all users");
    }
};
const getUserById = async (req, res) => {
    try {
        const user = await adminService.getUserById(req.params.id);
        sendResponse(res, {
            message: "User fetched successfully",
            data: { user },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch user by ID");
    }
};
const toggleUserStatus = async (req, res) => {
    try {
        const user = await adminService.toggleUserStatus(req.params.id);
        sendResponse(res, {
            message: user.isActive ? "User activated" : "User suspended",
            data: { user },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to toggle user status");
    }
};
const changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!role || !["CUSTOMER", "PROVIDER"].includes(role)) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "Valid role is required (CUSTOMER or PROVIDER)",
            });
        }
        const user = await adminService.changeUserRole(req.params.id, role);
        sendResponse(res, {
            message: `Role changed to ${role}`,
            data: { user },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to change user role");
    }
};
const getAllOrders = async (req, res) => {
    try {
        const result = await adminService.getAllOrders({
            status: req.query.status,
            page: req.query.page,
            limit: req.query.limit,
        });
        sendResponse(res, {
            message: "Orders fetched successfully",
            data: result,
        });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch all orders");
    }
};
const getDashboardStats = async (req, res) => {
    try {
        const stats = await adminService.getDashboardStats();
        sendResponse(res, {
            message: "Dashboard stats fetched successfully",
            data: { stats },
        });
    }
    catch (err) {
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
//# sourceMappingURL=admin.controller.js.map