import express from "express";
import {
  sendResetPasswordOtpController,
  resetPasswordWithOtpController,
} from "../controllers/resetPassword.controllers.js";

const router = express.Router();

router.post("/forgot-password", sendResetPasswordOtpController);
router.post("/reset-password", resetPasswordWithOtpController);

export default router;
