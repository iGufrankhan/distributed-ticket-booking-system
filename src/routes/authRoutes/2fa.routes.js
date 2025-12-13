import { Router } from "express";
import { initiate2FA, verifyAndEnable2FA, verify2FA, disable2FA } from "../../controllers/2fa.controllers.js";
import { verifyJWT } from "../../middlewares/auth/auth.middlewares.js";
import { validate } from "../../middlewares/auth/validate.middleware.js";
import Joi from "joi";

const router = Router();

// Validation schemas
const verify2FASchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

const verifyOtpSchema = Joi.object({
  otp: Joi.string().length(6).required(),
});

const disable2FASchema = Joi.object({
  password: Joi.string().required(),
});

// Protected routes - require authentication
router.post("/enable/request", verifyJWT, initiate2FA);
router.post("/enable/verify", verifyJWT, validate(verifyOtpSchema), verifyAndEnable2FA);
router.post("/disable", verifyJWT, validate(disable2FASchema), disable2FA);

// Public route - for login 2FA verification
router.post("/verify", validate(verify2FASchema), verify2FA);

export default router;
