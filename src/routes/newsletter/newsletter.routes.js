// newsletter.routes.js
import express from "express";
import { subscribeNewsletter, unsubscribeNewsletter } from "../controllers/newsletter.controllers.js";
import { verifyJWT } from "../middlewares/auth/auth.middlewares.js";

const router = express.Router();

router.use(verifyJWT);
router.post("/subscribe", subscribeNewsletter);
router.post("/unsubscribe", unsubscribeNewsletter);

export default router;