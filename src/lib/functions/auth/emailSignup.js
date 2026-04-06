import { User } from "../../../models/user.models.js";
import OTP from "../../../models/otp.models.js";
import bcrypt from "bcryptjs";
import { generateUsernameFromEmail } from "../../helper/generateUsernamefromemail.js";
import { ApiError } from "../../../../utils/ApiError.js";
import {ApiResponse} from "../../../../utils/ApiResponse.js";
import { sendOtp } from "./sendOtp.js";
import { EMAIL_FROM, CLIENT_URL } from "../../../../utils/constant.js";
import {generateAccessToken, generateRefreshToken, generateVerificationToken, verifyVerificationToken} from "../../../../utils/token.js";


export const initiateEmailSignup = async (email) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Send OTP
  await sendOtp(email, "signup");

  return { email };
};

export const initiateEmailforgotPassword = async (email) => {
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }

  // Send OTP
  await sendOtp(email, "resetPassword");

  return { email };
};

export const verifyEmailforgotPasswordOtp = async (email, otp) => {  
  const otpRecord = await OTP.findOne({
    email,
    otp,
    purpose: "resetPassword",
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {   
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Find user to get their ID
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete OTP after verification
  await OTP.deleteOne({ _id: otpRecord._id });
  
  // Generate token with userId, not email
  const accessToken = generateAccessToken(user._id);
  return new ApiResponse(200, { accessToken }, "OTP verified successfully");
};




export const verifyEmailSignupOtp = async (email, otp) => {  
  const otpRecord = await OTP.findOne({
    email,
    otp,
    purpose: "signup",
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {   
    throw new ApiError(400, "Invalid or expired OTP");
  }

  await OTP.deleteOne({ _id: otpRecord._id });

  // Generate a temporary verification token (valid for 10 minutes)
  const verificationToken = generateVerificationToken(email);

  // Return success with verification token - token required for registration
  return new ApiResponse(200, { email, verificationToken }, "OTP verified successfully. Use this token to complete registration.");
};



export const completeEmailSignup = async (name, email, password, verificationToken) => {
  // Validate verification token first
  if (!verificationToken) {
    throw new ApiError(400, "Verification token required. Please verify OTP first.");
  }

  const decoded = verifyVerificationToken(verificationToken);
  if (!decoded) {
    throw new ApiError(400, "Invalid or expired verification token. Please verify OTP again.");
  }

  // Ensure the email in token matches the registration email
  if (decoded.email !== email) {
    throw new ApiError(400, "Email mismatch. Please use the same email you verified.");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Generate username
  const username = await generateUsernameFromEmail(email);

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    fullName: name,
    username,
    email,
    password: hashedPassword,
    authProvider: "email",
    isEmailVerified: true,
  });
  
  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  newUser.refreshToken = refreshToken;
  await newUser.save({ validateBeforeSave: false });

  return new ApiResponse(201, {
    id: newUser._id,
    name: newUser.fullName,
    email: newUser.email,
    username: newUser.username,
    accessToken,
    refreshToken
  }, "User registered successfully");
};


