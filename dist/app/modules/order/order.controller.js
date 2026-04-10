import status from 'http-status';
import { orderService } from "./order.service.js";
import { sendResponse, handleError } from "../../utils/sendResponse.js";
const createOrder = async (req, res) => {
    try {
        const { providerId, deliveryAddress, note, items } = req.body;
        if (!providerId || !deliveryAddress || !items || !items.length) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "providerId, deliveryAddress and items are required",
            });
        }
        const order = await orderService.createOrder(req.user.id, {
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
    }
    catch (err) {
        handleError(res, err, "Failed to create order");
    }
};
const getMyOrders = async (req, res) => {
    try {
        const orders = await orderService.getMyOrders(req.user.id);
        sendResponse(res, {
            message: "Orders fetched successfully",
            data: { orders },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch orders");
    }
};
const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.role);
        sendResponse(res, {
            message: "Order fetched successfully",
            data: { order },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch order");
    }
};
const getProviderOrders = async (req, res) => {
    try {
        const orders = await orderService.getProviderOrders(req.user.id, req.query.status);
        sendResponse(res, {
            message: "Provider orders fetched successfully",
            data: { orders },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch provider orders");
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "Status is required",
            });
        }
        const order = await orderService.updateOrderStatus(req.user.id, req.params.id, status);
        sendResponse(res, {
            message: "Order status updated successfully",
            data: { order },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to update order status");
    }
};
const cancelOrder = async (req, res) => {
    try {
        const order = await orderService.cancelOrder(req.user.id, req.params.id);
        sendResponse(res, {
            message: "Order cancelled successfully",
            data: { order },
        });
    }
    catch (err) {
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
//# sourceMappingURL=order.controller.js.map