import { paymentQueue } from "../services/queue/queue.service.js";
import Payment from "../models/payments.models.js";
import { Booking } from "../models/booking.models.js";
import Seat from "../models/seat.models.js";
import { Show } from "../models/show.models.js";
import { client } from "../Config/redisConfig.js";
import { releaseSeats, unlockSeats } from "../services/booking/seatlock.service.js";
import { generateBookingCode } from "../utils/bookingCodeGenerator.js";
import {
  verifyPaymentSignature,
  fetchPaymentDetails,
} from "../services/payment-gateway/payment-service.js";
import { sendBookingConfirmationEmail, sendPaymentFailedEmail } from "../services/booking/notification.service.js"; 

// Process payment verification job (verify Razorpay payment)
paymentQueue.process('process-payment', async (job) => {
  const { paymentId, showId, seats, orderId, razorpayPaymentId, signature } = job.data;

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment record not found in database');
    }

    // Check if payment expired
    if (new Date() > payment.expiresAt) {
      payment.status = 'FAILED';
      payment.failureReason = 'Payment timeout - order expired';
      await payment.save();
      await releaseSeats(showId, seats);
      await sendPaymentFailedEmail(payment.userEmail, paymentId);
      throw new Error('Payment timeout - order expired');
    }

    // Step 1: Verify payment signature with Razorpay (real payment gateway)
    const isVerified = await verifyPaymentSignature(orderId, razorpayPaymentId, signature);

    if (!isVerified) {
      payment.status = 'FAILED';
      payment.failureReason = 'Payment signature verification failed - possible fraud';
      await payment.save();
      await releaseSeats(showId, seats);
      await sendPaymentFailedEmail(payment.userEmail, paymentId);
      throw new Error('Razorpay signature verification failed');
    }

    // Step 2: Fetch payment details from Razorpay
    const paymentDetails = await fetchPaymentDetails(razorpayPaymentId);
    
    if (!paymentDetails || paymentDetails.status !== 'captured') {
      throw new Error(`Payment status is not captured, got: ${paymentDetails?.status || 'unknown'}`);
    }

    // Step 3: Mark payment as completed in database
    payment.status = 'COMPLETED';
    payment.paymentId = razorpayPaymentId;
    payment.orderStatus = paymentDetails.status;
    payment.method = paymentDetails.method;
    payment.completedAt = new Date();
    await payment.save();

    // Step 4: Create booking with confirmed status
    const booking = await Booking.create({
      userId: payment.userId,
      showId,
      seats,
      paymentId: payment._id,
      status: 'CONFIRMED',
      totalAmount: payment.amount,
      bookingCode: generateBookingCode(),
      completedAt: new Date()
    });

    // Step 5: Update seats to booked permanently
    await Seat.updateMany(
      { showId, seatNumber: { $in: seats } },
      { 
        status: 'BOOKED', 
        bookingId: booking._id,
        lockedBy: null,
        lockedAt: null,
        lockedUntil: null
      }
    );

    // Step 6: Update show available seats count
    await Show.findByIdAndUpdate(showId, {
      $inc: { availableSeats: -seats.length }
    });

    // Step 7: Clear Redis cache for this show
    await client.del(`show:${showId}:seats`);
    await client.del(`show:${showId}:availability`);

    // Step 8: Send booking confirmation email
    await sendBookingConfirmationEmail({
      _id: booking._id,
      bookingCode: booking.bookingCode,
      userEmail: payment.userEmail,
      amount: payment.amount,
      seats: seats,
      showId: showId
    });

    job.progress(100);
    
    return { 
      success: true, 
      bookingId: booking._id,
      bookingCode: booking.bookingCode,
      razorpayPaymentId,
      message: 'Payment verified and booking confirmed'
    };

  } catch (error) {
    try {
      const payment = await Payment.findById(paymentId);
      
      if (payment && payment.status !== 'FAILED') {
        payment.status = 'FAILED';
        payment.failureReason = error.message;
        await payment.save();
      }

      // Release seats back to available
      await releaseSeats(showId, seats);
      
      // Send payment failed email
      if (payment?.userEmail) {
        await sendPaymentFailedEmail(payment.userEmail, paymentId);
      }
    } catch (cleanupError) {
      console.error("Error during payment failure cleanup:", cleanupError.message);
    }
    
    throw error;
  }
});

// Check payment timeout job - validates if payment was made within time window
paymentQueue.process('check-payment-timeout', async (job) => {
  const { paymentId, showId, seats, orderId } = job.data;

  try {
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return;
    }

    if (payment.status === 'COMPLETED') {
      return;
    }

    if (payment.status === 'FAILED') {
      await unlockSeats(showId, seats, payment.userId);
      return;
    }

    // Check if payment has exceeded timeout window
    if (new Date() > payment.expiresAt) {
      
      // Mark as failed
      payment.status = 'FAILED';
      payment.failureReason = 'Payment not completed within time window (10 minutes)';
      await payment.save();

      // Release seats back to available
      await releaseSeats(showId, seats);
      
      // Notify user
      if (payment.userEmail) {
        await sendPaymentFailedEmail(
          payment.userEmail, 
          paymentId,
          'Your payment was not completed within the allowed time. Your seat reservation has been cancelled.'
        );
      }
    }

  } catch (error) {
    console.error("Error in payment timeout check:", error.message);
  }
});

// Queue event listeners for monitoring
paymentQueue.on('completed', (job) => {
  // Job completed successfully
  console.log(`Payment job completed: ${job.id}`);
});

paymentQueue.on('failed', (job, err) => {
  // Job failed
  console.error(`Payment job failed: ${job.id}, error: ${err.message}`);
});

paymentQueue.on('error', (err) => {
  // Queue error
  console.error(`Payment queue error: ${err.message}`);
});