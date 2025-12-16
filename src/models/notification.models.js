import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Notification title is required"],
    trim: true,
  },
  message: {
    type: String,
    required: [true, "Notification message is required"],
    trim: true,
  },
  targetType: {
    type: String,
    enum: ["ALL", "MOVIE", "VENUE", "USER"],
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    // Reference can be Movie, Venue, or User based on targetType
    refPath: 'targetModel',
  },
  targetModel: {
    type: String,
    enum: ["Movie", "Venue", "User"],
  },
  status: {
    type: String,
    enum: ["sent", "scheduled"],
    default: "sent",
  },
  scheduledFor: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);

