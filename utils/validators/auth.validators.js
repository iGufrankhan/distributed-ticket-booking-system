import Joi from "joi";

// Strong password pattern: min 8 chars, uppercase, lowercase, number
const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
const strongPasswordMessage = 'Password must be at least 8 characters and contain uppercase, lowercase, and number';

export const sendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

export const completeSignupSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(strongPasswordPattern)
    .required()
    .messages({
      'string.pattern.base': strongPasswordMessage,
      'string.min': 'Password must be at least 8 characters long',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Reset password validators
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(strongPasswordPattern)
    .required()
    .messages({
      'string.pattern.base': strongPasswordMessage,
      'string.min': 'New password must be at least 8 characters long',
    }),
});


