import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth/auth.middlewares.js";
import {
  createPaymentOrderController,
  generatePaymentOptionsController,
  verifyPaymentSignatureController,
  verifyPaymentWebhookController,
  fetchPaymentDetailsController,
  refundPaymentController,
} from "../../controllers/payment-gateway/payment-controllers.js";

const router = Router();

/**
 * Payment Routes
 * Base URL: /api/v1/payment
 */

/**
 * Create payment order (Server-side)
 * POST /api/v1/payment/create-order
 * @param {number} amount - Amount in paise (required)
 * @param {string} currency - Currency code (default: INR)
 * @param {string} receipt - Unique receipt ID (required)
 * @returns {Object} Order details with order_id
 */
router.post("/create-order", verifyJWT, createPaymentOrderController);

/**
 * Generate payment options (Client-side)
 * POST /api/v1/payment/generate-options
 * @param {string} orderId - Razorpay order ID (required)
 * @param {number} amount - Amount in paise (required)
 * @param {Object} customerDetails - Customer info (optional)
 * @returns {Object} Razorpay payment options for frontend
 */
router.post("/generate-options", verifyJWT, generatePaymentOptionsController);

/**
 * Verify payment signature
 * POST /api/v1/payment/verify-signature
 * @param {string} orderId - Razorpay order ID (required)
 * @param {string} paymentId - Razorpay payment ID (required)
 * @param {string} signature - Razorpay signature (required)
 * @returns {Object} Verification result { verified: boolean }
 */
router.post("/verify-signature", verifyJWT, verifyPaymentSignatureController);

/**
 * Verify Razorpay webhook signature (server to server)
 * POST /api/v1/payment/webhook
 */
router.post("/webhook", verifyPaymentWebhookController);

/**
 * Fetch payment details
 * GET /api/v1/payment/details/:paymentId
 * @param {string} paymentId - Razorpay payment ID (URL param)
 * @returns {Object} Payment details with amount, status, method, etc.
 */
router.get("/details/:paymentId", verifyJWT, fetchPaymentDetailsController);

/**
 * Process refund
 * POST /api/v1/payment/refund
 * @param {string} paymentId - Razorpay payment ID (required)
 * @param {number} amount - Refund amount in paise (optional, full if not provided)
 * @returns {Object} Refund details with refund_id and status
 */
router.post("/refund", verifyJWT, refundPaymentController);


export default router;
