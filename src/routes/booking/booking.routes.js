import express from "express";
import { 
  bookSeats,
  getBookingStatus,
  confirmBooking,
  getUserBookings,
  cancelBooking,
  getAllSeatsOfShow
} from "../../controllers/booking/booking.controllers.js";
import { verifyJWT } from "../../middlewares/auth/auth.middlewares.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/seats/:showId", getAllSeatsOfShow);

// All other booking routes require authentication
router.use(verifyJWT);

router.post("/book-seats", bookSeats);
router.post("/confirm", confirmBooking);
router.get("/", getUserBookings);
router.post("/:bookingId/cancel", cancelBooking);
router.get("/:bookingId", getBookingStatus);  // This wildcard must be LAST

export default router;
