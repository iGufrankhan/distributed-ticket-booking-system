import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    provider: {
      type: String,
      enum: ["MOCK", "STRIPE", "RAZORPAY"],
      default: "MOCK",
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "TIMEOUT"],
      default: "PENDING",
      index: true,
    },

    paymentIntentId: {
      type: String,
      unique: true,
      sparse: true,
    },

    failureReason: {
      type: String,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    idempotencyKey: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
