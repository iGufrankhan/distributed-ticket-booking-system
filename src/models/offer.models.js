import mongoose from "mongoose";
const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: String,

    offerType: {
      type: String,
      enum: ["MOVIE", "RESTAURANT", "OTT"],
      required: true
    },

    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      required: true
    },

    discountValue: {
      type: Number,
      required: true
    },

    minOrderAmount: {
      type: Number,
      default: 0
    },

    maxDiscount: {
      type: Number
    },

    couponCode: {
      type: String,
      unique: true,
      uppercase: true
    },

    validFrom: Date,
    validTill: Date,

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Offer = mongoose.model("Offer", offerSchema);
