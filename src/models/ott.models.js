import mongoose from "mongoose";

const ottSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    platformName: {
      type: String,
      required: true
    },

    platform: {
      type: String,
      enum: ['Netflix', 'Prime Video', 'Hotstar', 'Sony Liv', 'Zee5', 'Other'],
      required: true,
    },

    genre: String,

    language: String,

    contentType: {
      type: String,
      enum: ['movie', 'series', 'documentary', 'short'],
      default: 'movie',
    },

    rating: {
      type: Number,
      min: 0,
      max: 10,
    },

    releaseDate: Date,

    views: {
      type: Number,
      default: 0,
    },

    description: String,

    image: String,

    trailer: String,

    subscriptionPlans: [
      {
        planName: String,
        price: Number,
        durationInMonths: Number
      }
    ],

    supportedDevices: {
      type: [String] // Mobile, TV, Web
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

export const OTT = mongoose.model("OTT", ottSchema);
