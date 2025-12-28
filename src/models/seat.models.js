import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    row: {
      type: String,
      required: true,
    },
    column: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["REGULAR", "PREMIUM", "VIP"],
      default: "REGULAR",
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'locked', 'booked'],
      default: 'available'
    },
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lockedAt: {
      type: Date
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    isBooked: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

seatSchema.index({ showId: 1, seatNumber: 1 }, { unique: true });
seatSchema.index({ showId: 1, status: 1 });

export default mongoose.model("Seat", seatSchema);
