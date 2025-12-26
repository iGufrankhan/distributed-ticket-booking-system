import { lockSeats } from "../../services/booking/seatlock.service.js";
import Payment from "../../models/payments.models.js";
import { paymentQueue } from "../../services/queue/queue.service.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const bookSeats = asyncHandler(async (req, res) => {
  const { showId, seats } = req.body;
  const userId = req.user._id;

  await lockSeats(showId, seats, userId);

  const payment = await Payment.create({
    userId,
    orderId: `${Date.now()}-${userId}`,
    amount: seats.length * 250,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    idempotencyKey: `${Date.now()}-${userId}`
  });

  await paymentQueue.add('process-payment', {
    paymentId: payment._id,
    showId,
    seats,
  });

  res.status(201).json(
    new ApiResponse(201, {
      paymentId: payment._id,
      orderId: payment.orderId
    }, "Seats locked. Processing payment...")
  );
});
