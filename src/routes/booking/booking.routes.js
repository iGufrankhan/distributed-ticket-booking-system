import express from "express";
import { bookSeats } from "../../controllers/booking/booking.controllers.js";
import { verifyJWT } from "../../middlewares/auth/auth.middlewares.js";

const router = express.Router();

router.post("/book", verifyJWT, bookSeats);

export default router;
