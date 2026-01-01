import { paymentQueue } from "../services/queue/queue.service.js";
import Payment from "../models/payments.models.js";
import { Booking } from "../models/booking.models.js";
import Seat from "../models/seat.models.js";
import { Show } from "../models/show.models.js";
import { client } from "../Config/redisConfig.js";
import { releaseSeats } from "../services/booking/seatlock.service.js";
import mongoose from "mongoose";
import { sendBookingConfirmationEmail, sendPaymentFailedEmail } from "../services/booking/notification.service.js"; 

// Process payment job
paymentQueue.process('process-payment', async (job) => {
  const { paymentId, showId, seats } = job.data;

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Check if payment expired
    if (new Date() > payment.expiresAt) {
      payment.status = 'FAILED';
      payment.failureReason = 'Payment timeout';
      await payment.save();
      await releaseSeats(showId, seats);
      await sendPaymentFailedEmail(payment.userEmail, paymentId);
      throw new Error('Payment timeout');
    }

    // Simulate payment processing (replace with actual payment gateway)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const isPaymentSuccessful = Math.random() > 0.1; 

    if (!isPaymentSuccessful) {
      payment.status = 'FAILED';
      payment.failureReason = 'Payment gateway error';
      await payment.save();
      await sendPaymentFailedEmail(payment.userEmail, paymentId);
      throw new Error('Payment gateway error');
    }

    // Mark payment as completed
    payment.status = 'COMPLETED';
    payment.completedAt = new Date();
    await payment.save();

    // Create booking
    const booking = await Booking.create({
      userId: payment.userId,
      showId,
      seats,
      paymentId: payment._id,
      status: 'CONFIRMED',
      totalAmount: payment.amount,
      bookingCode: generateBookingCode(),
      expiresAt: payment.expiresAt 
    });

    // Update seats to booked
    await Seat.updateMany(
      { showId, seatNumber: { $in: seats } },
      { 
        status: 'BOOKED', 
        bookingId: booking._id,
        lockedBy: null,
        lockedAt: null,
        isBooked: true
      }
    );

    // Update show available seats
    await Show.findByIdAndUpdate(showId, {
      $inc: { availableSeats: -seats.length }
    });

    // Clear cache
    await client.del(`show:${showId}:seats`);

    // Send booking confirmation email
    await sendBookingConfirmationEmail({
      _id: booking._id,
      userEmail: payment.userEmail,
    });

    console.log(`✅ Payment processed successfully for booking: ${booking.bookingCode}`);
    return { success: true, bookingId: booking._id };

  } catch (error) {
    console.error(`❌ Payment processing failed:`, error.message);
    await handlePaymentFailure(paymentId, showId, seats, error.message);
    // Send payment failed email if not already sent
    try {
      const payment = await Payment.findById(paymentId);
      if (payment && payment.userEmail) {
        await sendPaymentFailedEmail(payment.userEmail, paymentId);
      }
    } catch (e) {
      console.error("Error sending payment failed email:", e.message);
    }
    throw error;
  }
});

// Check payment timeout job
paymentQueue.process('check-payment-timeout', async (job) => {
  const { paymentId, showId, seats } = job.data;

  try {
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      console.log(`Payment ${paymentId} not found`);
      return;
    }

    if (payment.status !== 'PENDING') {
      console.log(`Payment ${paymentId} already processed`);
      return;
    }

    if (new Date() > payment.expiresAt) {
      console.log(`⏱️ Payment timeout for ${paymentId}`);
      await handlePaymentFailure(paymentId, showId, seats, 'Payment timeout');
      // Send payment failed email
      if (payment.userEmail) {
        await sendPaymentFailedEmail(payment.userEmail, paymentId);
      }
    }
  } catch (error) {
    console.error('Error checking payment timeout:', error);
  }
});

// Helper functions
async function handlePaymentFailure(paymentId, showId, seats, reason) {
  try {
    await Payment.findByIdAndUpdate(paymentId, {
      status: 'FAILED',
      failureReason: reason
    });

    await releaseSeats(showId, seats);
    
    console.log(`🔓 Seats released for failed payment: ${paymentId}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

function generateBookingCode() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `BK${timestamp}${random}`;
}

console.log('✅ Payment worker started and listening for jobs');