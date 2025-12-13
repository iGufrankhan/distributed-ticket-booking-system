import { Router } from "express";
import { 
  sendOtp, 
  verifyOtp, 
  registerUser, 
  loginUser, 
  getMe,
  resendVerificationOtp,
  changePassword
} from "../../controllers/auth.controllers.js";
import { verifyJWT } from "../../middlewares/auth/auth.middlewares.js";
import { validate } from "../../middlewares/auth/validate.middleware.js";
import {logoutUser} from "../../controllers/logOut.controllers.js";
import { 
  sendOtpSchema, 
  verifyOtpSchema, 
  completeSignupSchema, 
  loginSchema
} from "../../../utils/validators/auth.validators.js";

import {
  otpLimiter,
  loginLimiter
} from  "../../middlewares/auth/rateLimiter.middlewares.js";

const router = Router();

// Public routes - OTP-based signup flow
router.post("/send-otp", otpLimiter, validate(sendOtpSchema), sendOtp);           // Step 1: Send OTP
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);       // Step 2: Verify OTP
router.post("/register", validate(completeSignupSchema), registerUser);      // Step 3: Complete registration
router.post("/login",loginLimiter, validate(loginSchema), loginUser);
router.post("/resend-otp",otpLimiter, validate(sendOtpSchema), resendVerificationOtp);
router.post("/change-password", verifyJWT, changePassword);
router.post("/logout", logoutUser);

// Protected routes
router.get("/me", verifyJWT, getMe);

export default router;