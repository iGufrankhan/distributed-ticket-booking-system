import Joi from "joi";

// Validation schemas
export const verify2FASchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

export const verifyOtpSchema = Joi.object({
  otp: Joi.string().length(6).required(),
});

export const disable2FASchema = Joi.object({
  password: Joi.string().required(),
});