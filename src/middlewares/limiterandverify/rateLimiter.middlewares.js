import rateLimit from "express-rate-limit";


export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 5 min
  max: 5,                 // 5 requests
  message: "Too many attempts. Try again later.",
});


export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});