import Payment from "../../models/payments.models.js";
import { releaseSeats } from "./seatlock.service.js";
import { ApiError } from "../../../utils/ApiError.js";
import mongoose from "mongoose";

export const Createpayment = async (orderId, userId, amount, userEmail) => {
    if (typeof amount !== "number" || isNaN(amount)) {
        throw new ApiError('Amount must be a valid number', 400);
    }
    const payment = new Payment({
        orderId: String(orderId),
        userId: new mongoose.Types.ObjectId(userId), 
        userEmail, 
        amount: Number(amount),
        status: "PENDING",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        idempotencyKey: `${orderId}-${Date.now()}`
    });
    await payment.save();
    return payment;
};

export const Confirmpayment = async (paymentId, status, failureReason = null) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new ApiError('Payment not found', 404);
    }
    if (payment.status !== 'PENDING') {
        throw new ApiError('Payment already processed', 400);
    }
    payment.status = status;
    if (failureReason) {
        payment.failureReason = failureReason;
    }
    if (status === 'FAILED' || status === 'TIMEOUT') {
        await releaseSeats(payment.orderId);
    }
    await payment.save();
    return payment;
};

export const GetpaymentStatus = async (paymentId) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new ApiError('Payment not found', 404);
    }
    return payment.status;
};

export const Cancelpayment = async (paymentId) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new ApiError('Payment not found', 404);
    }
    if (payment.status !== 'PENDING') {
        throw new ApiError('Only pending payments can be cancelled', 400);
    }
    payment.status = 'CANCELLED';
    await payment.save();
    await releaseSeats(payment.orderId);
    return payment;
};
