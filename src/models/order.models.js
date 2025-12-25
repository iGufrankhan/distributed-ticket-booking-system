import mongoose from "mongoose";



const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },

    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "venue",
      required: true
    },

    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true
    },

    seats: [
      {
        seatNumber: String,
        row: String,
        price: Number
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING"
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "CARD", "NETBANKING", "WALLET"]
    },
    paymentID: {
      type: String
    },

    bookingStatus: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED", "PENDING"],
      default: "PENDING"
    },

    bookingTime: {
      type: Date,
      default: Date.now
    },

    orderId: {
      type: String,
      unique: true,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.model("Order", orderSchema);
