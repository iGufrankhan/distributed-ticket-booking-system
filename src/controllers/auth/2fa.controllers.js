
import {ApiError} from "../../../utils/ApiError.js";
import {ApiResponse} from "../../../utils/ApiResponse.js";
import {asyncHandler} from "../../../utils/AsyncHandler.js";
import { send2FAOtp } from "../../services/auth/2fa.service.js";
import  OTP  from "../../models/otp.models.js";
import { User } from "../../models/user.models.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../utils/constant.js";
import {generateAccessToken} from "../../../utils/token.js";

/**
 * Request to enable 2FA - sends OTP to email
 */
export const initiate2FA = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (user.twoFactorEnabled) {
        throw new ApiError(400, "2FA is already enabled");
    }

    // Send OTP to verify email before enabling 2FA
    const { sendOtp } = await import("../lib/functions/auth/sendOtp.js");
    await sendOtp(user.email, "enable2FA");

    res.status(200).json(
        new ApiResponse(200, { email: user.email }, "OTP sent to your email. Verify to enable 2FA.")
    );
});

/**
 * Verify OTP and enable 2FA
 */
export const verifyAndEnable2FA = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    const user = await User.findById(req.user._id);

    if (user.twoFactorEnabled) {
        throw new ApiError(400, "2FA is already enabled");
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({
        email: user.email,
        otp,
        purpose: "enable2FA",
        expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Enable 2FA
    user.twoFactorEnabled = true;
    await user.save();

    res.status(200).json(
        new ApiResponse(200, null, "2FA enabled successfully")
    );
});

/**
 * Disable 2FA for logged-in user
 */
export const disable2FA = asyncHandler(async (req, res) => {
    const { password } = req.body;
    
    const user = await User.findById(req.user._id).select("+password");
    
    if (!user.twoFactorEnabled) {
        throw new ApiError(400, "2FA is not enabled");
    }

    // Verify password
    const bcrypt = await import("bcryptjs");
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new ApiError(401, "Invalid password");
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    await user.save();

    res.status(200).json(
        new ApiResponse(200, null, "2FA disabled successfully")
    );
});

/**
 * Verify 2FA OTP and complete login
 */
export const verify2FA = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    
    // Verify OTP
    const otpRecord = await OTP.findOne({ 
        email, 
        otp, 
        purpose: "login2FA",
        expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
        throw new ApiError(400, "Invalid or expired OTP");
    }
    
    // Get user
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });
    
    // Generate token
    const token = generateAccessToken(user._id);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                token,
                user: {
                    id: user._id,
                    name: user.fullName,
                    email: user.email,
                    username: user.username,
                    isAdmin: user.isAdmin,
                },
            },
            "Login successful"
        )
    );
});

   
