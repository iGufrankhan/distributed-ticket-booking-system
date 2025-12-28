import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export const GMAIL_USER = process.env.GMAIL_USER;
export const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
export const EMAIL_FROM = process.env.EMAIL_FROM || process.env.GMAIL_USER;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
export const OTP_EXPIRY_MINUTES = process.env.OTP_EXPIRY_MINUTES || 10;

// OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Redis Configuration
export const REDIS_HOST = process.env.REDIS_HOST || "localhost";
export const REDIS_PORT = parseInt(process.env.REDIS_PORT) || 6379;
export const REDIS_USERNAME = process.env.REDIS_USERNAME || "default";
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;
export const REDIS_DB = parseInt(process.env.REDIS_DB) || 0;

// Database Configuration
export const DB_NAME = "distributed_booking";
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// Booking & Seat Lock Configuration
export const SEAT_LOCK_EXPIRY = parseInt(process.env.SEAT_LOCK_EXPIRY) || 15; // minutes
export const PAYMENT_TIMEOUT = parseInt(process.env.PAYMENT_TIMEOUT) || 15 * 60 * 1000; // 15 minutes in milliseconds
export const MAX_SEATS_PER_BOOKING = parseInt(process.env.MAX_SEATS_PER_BOOKING) || 10;