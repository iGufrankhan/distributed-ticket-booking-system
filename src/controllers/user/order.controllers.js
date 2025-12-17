import { ApiError } from "../../../utils/ApiError.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { Order } from "../../models/order.models.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

// get user orders
export const getUserOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
        .populate('movie')
        .populate('venue')
        .populate('show')
        .sort({ createdAt: -1 });
    
    return res.status(200).json(new ApiResponse(200, "Orders fetched successfully", orders));
});

// get order by id
export const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user._id;
    
    const order = await Order.findOne({ _id: orderId, user: userId })
        .populate('movie')
        .populate('venue')
        .populate('show');
    
    if (!order) {
        throw new ApiError(404, "Order not found");
    }
    
    return res.status(200).json(new ApiResponse(200, "Order fetched successfully", order));
});



