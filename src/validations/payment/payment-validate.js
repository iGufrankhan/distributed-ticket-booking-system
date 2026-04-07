import Joi from "joi";
import { ApiError } from "../../../utils/ApiError.js";

/**
 * Validate payment amount
 * @param {number} amount - Amount in smallest currency unit (paise for INR)
 * @returns {boolean}
 */
export const validateAmount = (amount) => {
  return Number.isInteger(amount) && amount > 0;
};

/**
 * Validate payment method
 * @param {string} method - Payment method (CARD, NETBANKING, WALLET, UPI, etc.)
 * @returns {boolean}
 */
export const validatePaymentMethod = (method) => {
  const validMethods = ["CARD", "NETBANKING", "WALLET", "UPI", "EMI"];
  return validMethods.includes(method?.toUpperCase());
};

/**
 * JOI Schema for creating payment order
 */
export const createPaymentOrderSchema = Joi.object({
  amount: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Amount must be a number",
      "number.integer": "Amount must be an integer (in paise)",
      "number.positive": "Amount must be greater than 0",
      "any.required": "Amount is required",
    }),

  currency: Joi.string()
    .default("INR")
    .length(3)
    .uppercase()
    .messages({
      "string.length": "Currency code must be 3 characters (e.g., INR, USD)",
    }),

  receipt: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(100)
    .messages({
      "string.base": "Receipt must be a string",
      "string.empty": "Receipt cannot be empty",
      "string.min": "Receipt must be at least 3 characters",
      "string.max": "Receipt cannot exceed 100 characters",
      "any.required": "Receipt is required",
    }),
});

/**
 * JOI Schema for verifying payment signature
 */
export const verifyPaymentSignatureSchema = Joi.object({
  orderId: Joi.string()
    .required()
    .trim()
    .messages({
      "string.empty": "Order ID cannot be empty",
      "any.required": "Order ID is required",
    }),

  paymentId: Joi.string()
    .required()
    .trim()
    .messages({
      "string.empty": "Payment ID cannot be empty",
      "any.required": "Payment ID is required",
    }),

  signature: Joi.string()
    .required()
    .trim()
    .messages({
      "string.empty": "Signature cannot be empty",
      "any.required": "Signature is required",
    }),
});

/**
 * JOI Schema for fetching payment details
 */
export const fetchPaymentDetailsSchema = Joi.object({
  paymentId: Joi.string()
    .required()
    .trim()
    .messages({
      "string.empty": "Payment ID cannot be empty",
      "any.required": "Payment ID is required",
    }),
});

/**
 * JOI Schema for refunding payment
 */
export const refundPaymentSchema = Joi.object({
  paymentId: Joi.string()
    .required()
    .trim()
    .messages({
      "string.empty": "Payment ID cannot be empty",
      "any.required": "Payment ID is required",
    }),

  amount: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "Amount must be a number",
      "number.integer": "Amount must be an integer (in paise)",
      "number.positive": "Amount must be greater than 0",
    }),
});

/**
 * JOI Schema for simulating payment
 */
export const simulatePaymentSchema = Joi.object({
  amount: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Amount must be a number",
      "number.integer": "Amount must be an integer (in paise)",
      "number.positive": "Amount must be greater than 0",
      "any.required": "Amount is required",
    }),

  paymentMethod: Joi.string()
    .default("CARD")
    .uppercase()
    .valid("CARD", "NETBANKING", "WALLET", "UPI", "EMI")
    .messages({
      "any.only": "Payment method must be one of: CARD, NETBANKING, WALLET, UPI, EMI",
    }),
});

/**
 * JOI Schema for generating payment options
 */
export const generatePaymentOptionsSchema = Joi.object({
  orderId: Joi.string()
    .required()
    .trim()
    .messages({
      "string.empty": "Order ID cannot be empty",
      "any.required": "Order ID is required",
    }),

  amount: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Amount must be a number",
      "number.integer": "Amount must be an integer (in paise)",
      "number.positive": "Amount must be greater than 0",
      "any.required": "Amount is required",
    }),

  customerDetails: Joi.object({
    email: Joi.string()
      .email()
      .optional()
      .messages({
        "string.email": "Invalid email format",
      }),

    name: Joi.string()
      .optional()
      .min(2)
      .max(100)
      .messages({
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 100 characters",
      }),

    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional()
      .messages({
        "string.pattern.base": "Phone must be a valid 10-digit number",
      }),

    bookingId: Joi.string()
      .optional()
      .trim(),
  }).optional(),
});

/**
 * Validate request against JOI schema
 * @param {Object} data - Data to validate
 * @param {Object} schema - JOI schema
 * @throws {ApiError} If validation fails
 */
export const validatePaymentRequest = (data, schema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    throw new ApiError(400, `Validation error: ${errorMessages}`);
  }

  return value;
};

/**
 * Validate payment amount range
 * @param {number} amount - Amount to validate
 * @param {number} minAmount - Minimum amount (default: 100 paise)
 * @param {number} maxAmount - Maximum amount (default: 1000000 paise)
 * @throws {ApiError} If amount is outside range
 */
export const validateAmountRange = (amount, minAmount = 100, maxAmount = 1000000) => {
  if (amount < minAmount) {
    throw new ApiError(
      400,
      `Minimum payment amount is ₹${minAmount / 100} (${minAmount} paise)`
    );
  }

  if (amount > maxAmount) {
    throw new ApiError(
      400,
      `Maximum payment amount is ₹${maxAmount / 100} (${maxAmount} paise)`
    );
  }

  return true;
};

/**
 * Sanitize payment data (remove sensitive fields)
 * @param {Object} paymentData - Payment data object
 * @returns {Object} Sanitized payment data
 */
export const sanitizePaymentData = (paymentData) => {
  const sanitized = { ...paymentData };

  // Remove sensitive fields
  delete sanitized.key_secret;
  delete sanitized.token;
  delete sanitized.cvv;
  delete sanitized.card_number;

  return sanitized;
};
