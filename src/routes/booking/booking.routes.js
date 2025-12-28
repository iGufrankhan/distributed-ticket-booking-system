import express from "express";
import { 
  bookSeats,
  getBookingStatus,
  confirmBooking,
  getUserBookings,
  cancelBooking
} from "../../controllers/booking/booking.controllers.js";
import { verifyJWT } from "../../middlewares/auth/auth.middlewares.js";

const router = express.Router();

// All booking routes require authentication
router.use(verifyJWT);

router.post("/book", bookSeats);
router.post("/confirm", confirmBooking);
router.get("/status/:bookingId", getBookingStatus);
router.get("/my-bookings", getUserBookings);
router.patch("/cancel/:bookingId", cancelBooking);

export default router;
