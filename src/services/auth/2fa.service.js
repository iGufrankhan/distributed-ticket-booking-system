import { asyncHandler } from "../../../utils/AsyncHandler.js";
import {ApiResponse} from "../../../utils/ApiResponse.js";
import { ApiError } from "../../../utils/ApiError.js";
import { sendOtp } from "../../lib/functions/auth/sendOtp.js";

export const send2FAOtp = async (user) => {
    const email = user.email;
    const purpose = "login2FA"; 
    await sendOtp(email, purpose);
    return new ApiResponse(200, { email }, "2FA OTP sent successfully");
};




  