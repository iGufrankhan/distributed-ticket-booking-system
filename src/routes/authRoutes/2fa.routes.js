import { Router } from "express";
import { initiate2FA, verifyAndEnable2FA, verify2FA, disable2FA } from "../../controllers/auth/2fa.controllers.js";
import { verifyJWT } from "../../middlewares/auth/auth.middlewares.js";
import { validate } from "../../middlewares/limiterandverify/validate.middleware.js";
import { verifyOtpSchema, disable2FASchema, verify2FASchema } from "../../validations/auth/2fa.validations.js";
import Joi from "joi";

const router = Router();



// Protected routes - require authentication
router.post("/enable/request", verifyJWT, initiate2FA);
router.post("/enable/verify", verifyJWT, validate(verifyOtpSchema), verifyAndEnable2FA);
router.post("/disable", verifyJWT, validate(disable2FASchema), disable2FA);

// Public route - for login 2FA verification
router.post("/verify", validate(verify2FASchema), verify2FA);

export default router;
