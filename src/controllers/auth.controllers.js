import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { login } from "../services/auth.service.js";
import { 
  initiateEmailSignup, 
  verifyEmailSignupOtp, 
  completeEmailSignup 
} from "../lib/functions/auth/emailSignup.js";
import { 
  sendOtpSchema, 
  verifyOtpSchema, 
  completeSignupSchema, 
  loginSchema 
} from "../../utils/validators/auth.validators.js";

// Step 1: Send OTP to email
export const sendOtp = asyncHandler(async (req, res) => {
  const { error } = sendOtpSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { email } = req.body;
  await initiateEmailSignup(email);
  
  res.status(200).json(
    new ApiResponse(200, { email }, "OTP sent to your email")
  );
});

// Step 2: Verify OTP
export const verifyOtp = asyncHandler(async (req, res) => {
  const { error } = verifyOtpSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { email, otp } = req.body;
  const result = await verifyEmailSignupOtp(email, otp);
  
  res.status(200).json(result);
});

// Step 3: Complete Registration
export const registerUser = asyncHandler(async (req, res) => {
  const { error } = completeSignupSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { name, email, password } = req.body;
  const result = await completeEmailSignup(name, email, password);
  
  res.status(201).json(result);
});

// Login
export const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const result = await login(req.body);
  res.status(200).json(result);
});

// Get current user profile
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, req.user, "User profile fetched successfully")
  );
});
