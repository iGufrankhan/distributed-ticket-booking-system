import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { ApiError } from "../../../utils/ApiError.js";
import {
  createPaymentOrder,
  generatePaymentOptions,
  verifyPaymentSignature,
  verifyRazorpayWebhook,
  fetchPaymentDetails,
  refundPayment,
} from "../../services/payment-gateway/payment-service.js";

import {
  validatePaymentRequest,
  createPaymentOrderSchema,
  verifyPaymentSignatureSchema,
  fetchPaymentDetailsSchema,
  refundPaymentSchema,
  generatePaymentOptionsSchema,
} from "../../validations/payment/payment-validate.js";

/**
 * Create payment order
 * POST /api/v1/payment/create-order
 */
export const createPaymentOrderController = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = validatePaymentRequest(req.body, createPaymentOrderSchema);

  // Create order
  const order = await createPaymentOrder(
    validatedData.amount,
    validatedData.currency,
    validatedData.receipt
  );

  return res.status(201).json(
    new ApiResponse(201, order, "Payment order created successfully")
  );
});

/**
 * Generate payment options for client
 * POST /api/v1/payment/generate-options
 */
export const generatePaymentOptionsController = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = validatePaymentRequest(
    req.body,
    generatePaymentOptionsSchema
  );

  // Generate options
  const options = generatePaymentOptions(
    validatedData.orderId,
    validatedData.amount,
    validatedData.customerDetails
  );

  return res.status(200).json(
    new ApiResponse(200, options, "Payment options generated successfully")
  );
});


export const verifyPaymentSignatureController = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = validatePaymentRequest(
    req.body,
    verifyPaymentSignatureSchema
  );

  // Verify signature
  const isValid = verifyPaymentSignature(
    validatedData.orderId,
    validatedData.paymentId,
    validatedData.signature
  );

  return res.status(200).json(
    new ApiResponse(200, { verified: isValid }, "Payment signature verified successfully")
  );
});

/**
 * Verify Razorpay webhook signature
 * POST /api/v1/payment/webhook
 */
export const verifyPaymentWebhookController = asyncHandler(async (req, res) => {
  const rawBody = req.rawBody?.toString("utf8") || "";
  const signature = req.headers["x-razorpay-signature"];

  if (!rawBody) {
    throw new ApiError(400, "Raw webhook payload is required");
  }

  if (!signature || typeof signature !== "string") {
    throw new ApiError(400, "x-razorpay-signature header is required");
  }

  const verified = verifyRazorpayWebhook(rawBody, signature);

  if (!verified) {
    throw new ApiError(401, "Invalid webhook signature! Possible tampering detected.");
  }

  let payload = {};
  try {
    payload = JSON.parse(rawBody);
  } catch (error) {
    throw new ApiError(400, "Invalid webhook JSON payload");
  }

  return res.status(200).json(
    new ApiResponse(200, { verified, event: payload?.event || null }, "Webhook verified successfully")
  );
});

/**
 * Fetch payment details
 * GET /api/v1/payment/details/:paymentId
 */
export const fetchPaymentDetailsController = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  // Validate request
  const validatedData = validatePaymentRequest(
    { paymentId },
    fetchPaymentDetailsSchema
  );

  // Fetch payment details
  const paymentDetails = await fetchPaymentDetails(validatedData.paymentId);

  return res.status(200).json(
    new ApiResponse(200, paymentDetails, "Payment details fetched successfully")
  );
});

/**
 * Process refund
 * POST /api/v1/payment/refund
 */
export const refundPaymentController = asyncHandler(async (req, res) => {
  // Validate request
  const validatedData = validatePaymentRequest(req.body, refundPaymentSchema);

  // Process refund
  const refundResult = await refundPayment(
    validatedData.paymentId,
    validatedData.amount
  );

  return res.status(200).json(
    new ApiResponse(200, refundResult, "Payment refunded successfully")
  );
});


export const simulatePaymentController  =asyncHandler(async(req,res)=>{

  const {amount,method}=req.body;

  if(!amount)
  {
     throw new ApiError(400,"Amount is required for simulation")
  }

  const isSuccess=Math.random()<0.9;

   if (!isSuccess) {
    throw new ApiError(400, "Payment simulation failed randomly (10% chance)");
  }


return res.status(200).json(
    new ApiResponse(200, {
      success: true,
      paymentId: `sim_${Math.random().toString(36).substring(2, 10)}`,
      amount,
      method: method || "CARD"
    }, "Payment simulated successfully")
  );




});
