import {User} from '../../models/user.models.js';
import {ApiError} from '../../../utils/ApiError.js';
import OTP from '../../models/otp.models.js';
import bcrypt from "bcryptjs";
import { sendOtp } from '../../lib/functions/auth/sendOtp.js';
import { generateOtp } from '../../../utils/emailservices/generateOtp.js';
import { OTP_EXPIRY_MINUTES } from '../../../utils/constant.js';




export const sendResetPasswordOtp = async (email) => {

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }


    // Generate OTP
  const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    
    // Save OTP to database
    await OTP.deleteMany({ email, purpose: 'resetPassword' });
    await OTP.create({ email, otp, purpose: 'resetPassword', expiresAt });
    // Send OTP via email
    await sendOtp(email,
    "resetPassword",
    `Your password reset OTP is ${otp}`);  
    return { message: 'OTP sent successfully' };
};  





export const resetPasswordWithOtp = async (email, otp, newPassword) => {
  const otpRecord = await OTP.findOne({
    email,
    otp,
    purpose: "resetPassword",
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) throw new ApiError(400, "Invalid or expired OTP");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const user = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );
  
  if (!user) throw new ApiError(404, "User not found");

  await OTP.deleteOne({ _id: otpRecord._id });

  return { message: "Password reset successful" };
};









