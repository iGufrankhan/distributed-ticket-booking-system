import mongoose from "mongoose";
const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    address: {
      type: String
    },

    cuisine: {
      type: [String]
    },

    averageCostForTwo: {
      type: Number
    },

    rating: {
      type: Number,
      default: 0
    },

    reviewCount: {
      type: Number,
      default: 0
    },

    offers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer"
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
