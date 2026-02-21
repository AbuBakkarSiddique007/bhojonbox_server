import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { orderService } from "./order.service.js";


const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { providerId, deliveryAddress, note, items } = req.body;

        if (!providerId || !deliveryAddress || !items || !items.length) {
            res.status(400).json({
                message: "providerId, deliveryAddress and items are required",
            });
            return;
        }

        const order = await orderService.createOrder(req.user!.id, {
            providerId,
            deliveryAddress,
            note,
            items,
        });

        res.status(201).json({ order });

    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({ 
                message: err.message 
            });
            
            return;
        }
        res.status(500).json({
            message: "Failed to create order",
            error: err.message,
        });
    }
};


const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await orderService.getMyOrders(req.user!.id);

        res.status(200).json({ orders });
    } catch (err: any) {
        res.status(500).json({
            message: "Failed to fetch orders",
            error: err.message,
        });
    }
};


const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const order = await orderService.getOrderById(
            req.params.id as string,
            req.user!.id,
            req.user!.role
        );

        res.status(200).json({ order });
    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({ 
                message: err.message 
            });
            return;
        }
        res.status(500).json({
            message: "Failed to fetch order",
            error: err.message,
        });
    }
};


const getProviderOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await orderService.getProviderOrders(
            req.user!.id,
            req.query.status as string
        );

        res.status(200).json({ orders });
    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({ 
                message: err.message 
            });
            return;
        }
        res.status(500).json({
            message: "Failed to fetch provider orders",
            error: err.message,
        });
    }
};


const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;

        if (!status) {
            res.status(400).json({ message: "Status is required" });
            return;
        }

        const order = await orderService.updateOrderStatus(
            req.user!.id,
            req.params.id as string,
            status
        );

        res.status(200).json({ order });
    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({ 
                message: err.message 
            });
            return;
        }
        res.status(500).json({
            message: "Failed to update order status",
            error: err.message,
        });
    }
};


const cancelOrder = async (req: AuthRequest, res: Response) => {
    try {
        const order = await orderService.cancelOrder(
            req.user!.id,
            req.params.id as string
        );

        res.status(200).json({ order, message: "Order cancelled" });
    } catch (err: any) {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
            return;
        }
        res.status(500).json({
            message: "Failed to cancel order",
            error: err.message,
        });
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
