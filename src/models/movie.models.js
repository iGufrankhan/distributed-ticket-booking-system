import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    overview: { type: String, required: true },
    posterPath: { type: String, required: true },
    backdropPath: { type: String },
    releaseDate: { type: Date, required: true },
    originalLanguage: { type: String },
    availabilityLanguages: [{ type: String }],
    tagline: { type: String },
    genres: [{ type: String, required: true }],
    casts: [{ type: String }],
    voteAverage: { type: Number, min: 0, max: 10 },
    runtime: { type: Number, required: true }, // minutes
    trailerUrl: { type: String },
    rating: { type: String },
    reviewCount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
    },
  },
  { timestamps: true }
);

export const Movie = mongoose.model("Movie", movieSchema);
