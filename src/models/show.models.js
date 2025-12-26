import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
  
    showDateTime: {
      type: Date,
      required: true,
    },

    showPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    availableSeats: {
      type: Number,
      required: true,
    },

    occupiedSeats: {
      type: Object, 
      default: {},
    },

    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true, minimize: false }
);

showSchema.methods.isSeatAvailable = function(seatNumber) {
  return !this.occupiedSeats[seatNumber];
};

showSchema.methods.areSeatsAvailable = function(seatNumbers) {
  return seatNumbers.every(seat => !this.occupiedSeats[seat]);
};

export const Show = mongoose.model("Show", showSchema);