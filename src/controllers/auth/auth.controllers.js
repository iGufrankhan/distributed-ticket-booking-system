import {asyncHandler} from "../../../utils/AsyncHandler.js";
import {ApiResponse} from "../../../utils/ApiResponse.js";
import {ApiError} from "../../../utils/ApiError.js";
import { login } from "../../services/auth/auth.service.js";
import { User } from "../../models/user.models.js";
import { 
  initiateEmailSignup, 
  verifyEmailSignupOtp, 
  completeEmailSignup 
} from "../../lib/functions/auth/emailSignup.js";

// Step 1: Send OTP to email
export const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await initiateEmailSignup(email);
  
  res.status(200).json(
    new ApiResponse(200, { email }, "OTP sent to your email")
  );
});

// Step 2: Verify OTP
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await verifyEmailSignupOtp(email, otp);
  
  res.status(200).json(result);
});

// Step 3: Complete Registration
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const result = await completeEmailSignup(fullName, email, password);
  
  res.status(201).json(result);
});

// Login
export const loginUser = asyncHandler(async (req, res) => {
  const result = await login(req.body);
  res.status(200).json(result);
});

// Get current user profile
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, req.user, "User profile fetched successfully")
  );
});


export const resendVerificationOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email already verified");
  }

  // Reuse existing OTP logic
  await initiateEmailSignup(email);

  res.status(200).json(
    new ApiResponse(200, { email }, "Verification OTP resent successfully")
  );
});


export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) throw new ApiError(400, "Old password incorrect");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully" });
});


