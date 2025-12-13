import express from "express";
import {
  sendResetPasswordOtpController,
  resetPasswordWithOtpController,
} from "../../controllers/resetPassword.controllers.js";
import { validate } from "../../middlewares/auth/validate.middleware.js";
import { 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from "../../../utils/validators/auth.validators.js";

import 
{
  otpLimiter

} from  "../../middlewares/auth/rateLimiter.middlewares.js";

const router = express.Router();

router.post("/forgot-password",otpLimiter, validate(forgotPasswordSchema), sendResetPasswordOtpController);
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordWithOtpController);

export default router;
