import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { ApiError } from "../../../utils/ApiError.js";
import {
  createPaymentOrder,
  generatePaymentOptions,
  verifyPaymentSignature,
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



