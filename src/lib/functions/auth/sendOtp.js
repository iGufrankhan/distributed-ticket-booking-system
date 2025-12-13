import { ApiResponse } from "../../../../utils/ApiResponse.js";
import { createTransporter } from "../../../../utils/emailservices/createTransporter.js";
import { generateOtp ,generateOtpWithExpiry} from "../../../../utils/emailservices/generateOtp.js";
import OTP from "../../../models/otp.models.js";
import { OTP_EXPIRY_MINUTES, EMAIL_FROM } from "../../../../utils/constant.js";

export const sendOtp = async (email, purpose = "signup") => {
  try {
    // Generate OTP
    const otp = generateOtp();
    const expiresAt = generateOtpWithExpiry(6, OTP_EXPIRY_MINUTES).expiresAt;

    await OTP.deleteMany({ email, purpose });
    // Save OTP to database
    await OTP.create({ email, otp, purpose, expiresAt });
    // Send OTP via email
    const transporter = createTransporter();
    const mailOptions = {
        from: EMAIL_FROM,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };
    await transporter.sendMail(mailOptions);
    return new ApiResponse(200, null, "OTP sent successfully");

    } catch (error) {
        throw new Error("Failed to send OTP: " + error.message);
    }       

};

