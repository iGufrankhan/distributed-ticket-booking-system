import Seat from "../../models/seat.models.js";
import { Show } from "../../models/show.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { SEAT_LOCK_EXPIRY } from "../../../utils/constant.js";

export const checkSeatAvailability = async (showId, seatNumbers) => {
  const show = await Show.findById(showId);
  if (!show) {
    throw new ApiError(404, "Show not found");
  }

  if (!show.isActive) {
    throw new ApiError(400, "Show is not active");
  }

  const seats = await Seat.find({
    showId,
    seatNumber: { $in: seatNumbers }
  });

  if (seats.length !== seatNumbers.length) {
    throw new ApiError(400, "One or more seats do not exist");
  }

  // Check for expired locks and release them
  const now = new Date();
  const expiredLocks = seats.filter(
    seat => seat.status === 'locked' && 
    seat.lockedAt && 
    (now - seat.lockedAt) > (SEAT_LOCK_EXPIRY * 60 * 1000)
  );

  if (expiredLocks.length > 0) {
    await Seat.updateMany(
      { _id: { $in: expiredLocks.map(s => s._id) } },
      { status: 'available', lockedBy: null, lockedAt: null }
    );
  }

  // Refresh seats data
  const updatedSeats = await Seat.find({
    showId,
    seatNumber: { $in: seatNumbers }
  });

  const unavailableSeats = updatedSeats.filter(
    seat => seat.status !== 'available'
  );

  if (unavailableSeats.length > 0) {
    throw new ApiError(400, `Seats ${unavailableSeats.map(s => s.seatNumber).join(', ')} are not available`);
  }

  return { show, seats: updatedSeats };
};