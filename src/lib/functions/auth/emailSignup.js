import { User } from "../../../models/User.models.js";
import OTP from "../../../models/otp.models.js";
import bcrypt from "bcryptjs";
import { generateUsernameFromEmail } from "../../helper/generateUsernamefromemail.js";
import { ApiError } from "../../../../utils/ApiError.js";
import {ApiResponse} from "../../../../utils/ApiResponse.js";
import { sendOtp } from "./sendOtp.js";
import { EMAIL_FROM, CLIENT_URL } from "../../../../utils/constant.js";
import {generateAccessToken} from "../../../../utils/token.js";


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
    // OTP is valid, delete it
    await OTP.deleteMany({ email, purpose: "signup" });
    const accessToken = generateAccessToken(email);

    return new ApiResponse(200, { accessToken }, "OTP verified successfully");
};



export const completeEmailSignup = async (name, email, password) => {
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
  return new ApiResponse(
    201,
    {
      id: newUser._id,
      name: newUser.fullName,
      email: newUser.email,
      username: newUser.username,
    },
    "User registered successfully"
  );
};


