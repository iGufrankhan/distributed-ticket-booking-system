/**
 * Generate a random OTP of specified length
 */
export const generateOtp = (length = 6) => {
  const digits = "0123456789";
  let otp = "";
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  
  return otp;
};

/**
 * Generate OTP with expiry time
 */
export const generateOtpWithExpiry = (length = 6, expiryMinutes = 10) => {
  const otp = generateOtp(length);
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  
  return { otp, expiresAt };
};