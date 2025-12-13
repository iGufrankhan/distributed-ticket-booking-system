import { Router } from "express";
import { 
  sendOtp, 
  verifyOtp, 
  registerUser, 
  loginUser, 
  getMe 
} from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Public routes - OTP-based signup flow
router.post("/send-otp", sendOtp);           // Step 1: Send OTP
router.post("/verify-otp", verifyOtp);       // Step 2: Verify OTP
router.post("/register", registerUser);      // Step 3: Complete registration
router.post("/login", loginUser);

// Protected routes
router.get("/me", verifyJWT, getMe);

export default router;