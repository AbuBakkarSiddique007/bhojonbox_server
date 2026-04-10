import { Request, Response } from "express";
import status from 'http-status';
import { AuthRequest } from "../../middleware/auth";
import { orderService } from "./order.service.js";
import { sendResponse, handleError } from "../../utils/sendResponse";


const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { providerId, deliveryAddress, note, items } = req.body;

        if (!providerId || !deliveryAddress || !items || !items.length) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "providerId, deliveryAddress and items are required",
            });
        }

        const order = await orderService.createOrder(req.user!.id, {
            providerId,
            deliveryAddress,
            note,
            items,
        });

        sendResponse(res, {
            statusCode: status.CREATED,
            message: "Order created successfully",
            data: { order },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to create order");
    }
};


const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await orderService.getMyOrders(req.user!.id);

        sendResponse(res, {
            message: "Orders fetched successfully",
            data: { orders },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch orders");
    }
};


const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const order = await orderService.getOrderById(
            req.params.id as string,
            req.user!.id,
            req.user!.role
        );

        sendResponse(res, {
            message: "Order fetched successfully",
            data: { order },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch order");
    }
};


const getProviderOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await orderService.getProviderOrders(
            req.user!.id,
            req.query.status as string
        );

        sendResponse(res, {
            message: "Provider orders fetched successfully",
            data: { orders },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch provider orders");
    }
};


const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;

        if (!status) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "Status is required",
            });
        }

        const order = await orderService.updateOrderStatus(
            req.user!.id,
            req.params.id as string,
            status
        );

        sendResponse(res, {
            message: "Order status updated successfully",
            data: { order },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to update order status");
    }
};


const cancelOrder = async (req: AuthRequest, res: Response) => {
    try {
        const order = await orderService.cancelOrder(
            req.user!.id,
            req.params.id as string
        );

        sendResponse(res, {
            message: "Order cancelled successfully",
            data: { order },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to cancel order");
    }
};


export const orderController = {
    createOrder,
    getMyOrders,
    getOrderById,
    getProviderOrders,
    updateOrderStatus,
    cancelOrder,
};
