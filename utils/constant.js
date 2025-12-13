import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;
export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export const GMAIL_USER = process.env.GMAIL_USER;
export const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
export const EMAIL_FROM = process.env.EMAIL_FROM || process.env.GMAIL_USER;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
export const OTP_EXPIRY_MINUTES = process.env.OTP_EXPIRY_MINUTES || 10;