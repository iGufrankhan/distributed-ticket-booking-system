import { lockSeats } from "../../services/booking/seatlock.service.js";
import { checkSeatAvailability } from "../../services/booking/seat.service.js";
import { Createpayment } from "../../services/booking/payment.service.js";
import { Booking } from "../../models/booking.models.js";
import Payment from "../../models/payments.models.js";
import { paymentQueue } from "../../services/queue/queue.service.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { ApiError } from "../../../utils/ApiError.js";
import { MAX_SEATS_PER_BOOKING, PAYMENT_TIMEOUT } from "../../../utils/constant.js";
import { generateBookingCode } from '../../../utils/bookingCodeGenerator.js';

export const bookSeats = asyncHandler(async (req, res) => {
  const { showId, seats } = req.body;
  const userId = req.user._id;

  if (!seats || seats.length === 0) {
    throw new ApiError(400, "Please select at least one seat");
  }

  if (seats.length > MAX_SEATS_PER_BOOKING) {
    throw new ApiError(400, `Maximum ${MAX_SEATS_PER_BOOKING} seats allowed per booking`);
  }

  const { show } = await checkSeatAvailability(showId, seats);

  console.log("Show status:", show.status);

  // If your schema uses showPrice:
  const seatPrice = show.showPrice;
  if (typeof seatPrice !== "number" || isNaN(seatPrice)) {
    throw new ApiError(400, "Show price is invalid");
  }

  await lockSeats(showId, seats, userId);

  const amount = seats.length * seatPrice;
  let payment;
  try {
    payment = await Createpayment(
      `ORD-${Date.now()}-${userId}`,
      userId,
      amount,
      req.user.email 
    );
    if (!payment) {
      throw new ApiError(500, "Payment creation failed");
    }
  } catch (err) {
    console.error("Payment creation error:", err);
    throw err;
  }

  
  await paymentQueue.add('process-payment', {
    paymentId: payment._id,
    showId,
    seats,
  });

  await paymentQueue.add('check-payment-timeout', {
    paymentId: payment._id,
    showId,
    seats,
  }, { delay: PAYMENT_TIMEOUT });

  res.status(201).json(
    new ApiResponse(201, {
      paymentId: payment._id,
      orderId: payment.orderId,
      amount: payment.amount,
      expiresAt: payment.expiresAt
    }, "Seats locked. Processing payment...")
  );
});

export const getBookingStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id;

  const booking = await Booking.findById(bookingId)
    .populate('showId', 'startTime theaterId screenNumber')
    .populate('paymentId', 'status amount orderId');

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized access to booking");
  }

  res.status(200).json(
    new ApiResponse(200, booking, "Booking status retrieved successfully")
  );
});

export const confirmBooking = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;
  const userId = req.user._id;

  const payment = await Payment.findById(paymentId);
  
  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  const booking = await Booking.findOne({ paymentId })
    .populate('showId')
    .populate('paymentId');

  if (!booking) {
    throw new ApiError(404, "Booking not found. Payment may still be processing.");
  }

  res.status(200).json(
    new ApiResponse(200, booking, "Booking confirmed successfully")
  );
});

export const getUserBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status, page = 1, limit = 10 } = req.query;

  const query = { userId };
  if (status) {
    query.status = status;
  }

  const bookings = await Booking.find(query)
    .populate('showId', 'startTime theaterId screenNumber')
    .populate('paymentId', 'amount orderId status')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Booking.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    }, "Bookings retrieved successfully")
  );
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  if (booking.status !== 'CONFIRMED') {
    throw new ApiError(400, "Only confirmed bookings can be cancelled");
  }

  booking.status = 'CANCELLED';
  await booking.save();

  res.status(200).json(
    new ApiResponse(200, booking, "Booking cancelled successfully")
  );
});
