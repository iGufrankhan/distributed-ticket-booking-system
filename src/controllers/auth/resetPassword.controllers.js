import {ApiError} from '../../../utils/ApiError.js'; 
import {asyncHandler} from '../../../utils/AsyncHandler.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';

import {sendResetPasswordOtp, resetPasswordWithOtp} from '../../services/auth/resetPassword.service.js';



export const sendResetPasswordOtpController = asyncHandler(async (req, res, next) => {
    const {email} = req.body;
    const result = await sendResetPasswordOtp(email);
    res.status(200).json(new ApiResponse(200, "OTP sent successfully", result));
});

export const resetPasswordWithOtpController = asyncHandler(async (req, res, next) => {
    const {email, otp, newPassword} = req.body;
    const result = await resetPasswordWithOtp(email, otp, newPassword);
    res.status(200).json(new ApiResponse(200, "Password reset successful", result));
});









