import Payment from "../../models/payments.models.js";
import { releaseSeats } from "./seatlock.service.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { ApiError } from "../../../utils/ApiError.js";

export const Createpayment = asyncHandler(async (orderId, userId, amount) => {
    const payment = new Payment({
        orderId,
        userId,
        amount,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        idempotencyKey: `${orderId}-${Date.now()}`
    });
    await payment.save();
    return payment;
});

export const Confirmpayment = asyncHandler(async (paymentId, status, failureReason = null) => {
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
});

export const GetpaymentStatus = asyncHandler(async (paymentId) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new ApiError('Payment not found', 404);
    }
    return payment.status;
});

export const Cancelpayment = asyncHandler(async (paymentId) => {
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
});

