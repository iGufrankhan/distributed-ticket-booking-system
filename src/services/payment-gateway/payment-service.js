
import Razorpay from "razorpay";
import { ApiError } from "../../../utils/ApiError.js";
import {
  validateAmount,
  validatePaymentMethod,
  validateAmountRange,
  sanitizePaymentData,
} from "../../validations/payment/payment-validate.js";


const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "YOUR_KEY_ID",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YOUR_KEY_SECRET",
});

const getRequiredSecret = (envKey) => {
  const secret = process.env[envKey];
  if (!secret) {
    throw new ApiError(500, `${envKey} is not configured`);
  }
  return secret;
};

/**
 * Validate Razorpay signature using SDK helper
 * @param {string} body - Signature payload string
 * @param {string} signature - Razorpay signature
 * @param {string} secret - Secret used for HMAC validation
 * @returns {boolean}
 */
export const validateWebhookSignature = (body, signature, secret) => {
  if (!body || !signature || !secret) {
    throw new ApiError(400, "Body, signature, and secret are required for verification");
  }
  return Razorpay.validateWebhookSignature(body, signature, secret);
};

/**
 * Validate Razorpay webhook signature using webhook secret
 * @param {string} rawBody - Raw webhook body string
 * @param {string} signature - Razorpay webhook signature header value
 * @returns {boolean}
 */
export const verifyRazorpayWebhook = (rawBody, signature) => {
  const webhookSecret = getRequiredSecret("RAZORPAY_WEBHOOK_SECRET");
  return validateWebhookSignature(rawBody, signature, webhookSecret);
};


/**
 * Create Razorpay order (Server-side)
 * This should be called before payment to get order_id
 * @param {number} amount - Amount in paise (e.g., 50000 for ₹500)
 * @param {string} currency - Currency code (default: INR)
 * @param {string} receipt - Unique receipt ID
 * @returns {Promise<Object>} Order details with order_id
 */
export const createPaymentOrder = async (amount, currency = "INR", receipt) => {
  try {
    // Validate inputs
    if (!validateAmount(amount)) {
      throw new ApiError(400, "Invalid amount. Must be a positive integer in paise.");
    }

    // Validate amount range (min: ₹1, max: ₹10000)
    validateAmountRange(amount, 100, 1000000);

    if (!receipt || typeof receipt !== "string") {
      throw new ApiError(400, "Receipt ID is required and must be a string.");
    }

    // Create order
    const order = await razorpayInstance.orders.create({
      amount,
      currency,
      receipt,
      notes: {
        createdAt: new Date().toISOString(),
      },
    });

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    };
  } catch (error) {
    console.error("Razorpay order creation failed:", error.message);
    throw new ApiError(500, `Failed to create payment order: ${error.message}`);
  }
};



/**
 * Generate Razorpay payment options (Client-side)
 * Call this after order creation to pass options to frontend
 * @param {string} orderId - Razorpay order ID
 * @param {number} amount - Amount in paise
 * @param {Object} customerDetails - { email, name, phone }
 * @returns {Object} Razorpay options for client
 */
export const generatePaymentOptions = (orderId, amount, customerDetails = {}) => {
  try {
    if (!orderId) {
      throw new ApiError(400, "Order ID is required");
    }

    if (!validateAmount(amount)) {
      throw new ApiError(400, "Invalid amount");
    }

    return {
      order_id: orderId,
      amount,
      currency: "INR",
      name: "Ticket Booking System",
      description: "Movie Ticket Booking",
      prefill: {
        email: customerDetails.email || "",
        name: customerDetails.name || "",
        contact: customerDetails.phone || "",
      },
      theme: {
        color: "#3880ff",
      },
      notes: {
        bookingId: customerDetails.bookingId || "",
      },
    };
  } catch (error) {
    console.error("Failed to generate payment options:", error.message);
    throw error;
  }
};

/** 
 * Verify Razorpay payment signature (Server-side)
 * Call this after payment to verify authenticity
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature from webhook/response
 * @returns {boolean} True if signature is valid
 */
export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    if (!orderId || !paymentId || !signature) {
      throw new ApiError(400, "Order ID, Payment ID, and Signature are required");
    }

    const body = orderId + "|" + paymentId;
  const keySecret = getRequiredSecret("RAZORPAY_KEY_SECRET");
  const isValid = validateWebhookSignature(body, signature, keySecret);

    if (!isValid) {
      throw new ApiError(400, "Payment signature verification failed. Payment may be fraudulent.");
    }

    return true;
  } catch (error) {
    console.error("Signature verification error:", error.message);
    throw error;
  }
};

/**
 * Fetch payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment details
 */
export const fetchPaymentDetails = async (paymentId) => {
  try {
    if (!paymentId) {
      throw new ApiError(400, "Payment ID is required");
    }

    const payment = await razorpayInstance.payments.fetch(paymentId);

    const paymentDetails = {
      success: true,
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      description: payment.description,
      email: payment.email,
      contact: payment.contact,
      createdAt: new Date(payment.created_at * 1000),
    };

    // Sanitize sensitive data
    return sanitizePaymentData(paymentDetails);
  } catch (error) {
    console.error("Failed to fetch payment details:", error.message);
    throw new ApiError(500, `Failed to fetch payment details: ${error.message}`);
  }
};

/**
 * Refund a payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Amount to refund in paise (optional, full refund if not provided)
 * @returns {Promise<Object>} Refund details
 */
export const refundPayment = async (paymentId, amount = null) => {
  try {
    if (!paymentId) {
      throw new ApiError(400, "Payment ID is required");
    }

    const refundData = amount ? { amount } : {};
    const refund = await razorpayInstance.payments.refund(paymentId, refundData);

    return {
      success: true,
      refundId: refund.id,
      paymentId: refund.payment_id,
      amount: refund.amount,
      status: refund.status,
      createdAt: new Date(refund.created_at * 1000),
    };
  } catch (error) {
    console.error("Refund failed:", error.message);
    throw new ApiError(500, `Failed to process refund: ${error.message}`);
  }
};

/**
 * Simulate payment for testing (Non-production)
 * @param {number} amount - Amount in paise
 * @param {string} paymentMethod - Payment method
 * @returns {Promise<Object>} Simulated payment response
 */
export const simulatePaymentProcessing = async (amount, paymentMethod = "CARD") => {
  try {
    // Validate inputs
    if (!validateAmount(amount)) {
      throw new ApiError(400, "Invalid amount. Must be a positive integer in paise.");
    }

    if (!validatePaymentMethod(paymentMethod)) {
      throw new ApiError(400, `Invalid payment method. Valid methods: CARD, NETBANKING, WALLET, UPI, EMI`);
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate random success/failure (90% success rate for testing)
    const isSuccess = Math.random() < 0.9;

    if (!isSuccess) {
      throw new Error("Simulated payment failure for testing");
    }

    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
      orderId: `order_${Date.now()}`,
      amount,
      currency: "INR",
      paymentMethod,
      status: "COMPLETED",
      message: "Payment processed successfully (simulated)",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Simulated payment error:", error.message);
    throw new ApiError(500, `Payment simulation failed: ${error.message}`);
  }
};