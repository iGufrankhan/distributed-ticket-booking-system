import { ApiError } from "../../../utils/ApiError.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { Show } from "../../models/show.models.js";
import { Movie } from "../../models/movie.models.js";
import Venue from "../../models/venue.models.js";
import { User } from "../../models/user.models.js";
import { Notification } from "../../models/notification.models.js";
import { createTransporter } from "../../../utils/emailservices/createTransporter.js";

// Helper to send email
const sendEmailToUsers = async (users, subject, message) => {
  if (!users || users.length === 0) return;
  const transporter = createTransporter();
  for (const user of users) {
    if (user.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject,
        text: message,
      });
    }
  }
};

// send notification to all users
export const sendNotificationToAll = asyncHandler(async (req, res) => {
  const { title, message } = req.body;

  const notification = await Notification.create({
    title,
    message,
    targetType: "ALL",
    status: "sent",
    createdBy: req.user._id,
  });

  const users = await User.find({}, "email");
  await sendEmailToUsers(users, title, message);

  res.status(200).json({
    success: true,
    message: `Notification sent to ${users.length} users`,
    data: notification,
  });
});

// send notification to users of a specific movie
export const sendNotificationToMovieWatchers = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { title, message } = req.body;

  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  const notification = await Notification.create({
    title,
    message,
    targetType: "MOVIE",
    targetId: movieId,
    status: "sent",
    createdBy: req.user._id,
  });

  // Find users who booked this movie
  const shows = await Show.find({ movie: movieId }, "_id");
  const showIds = shows.map(s => s._id);
  const users = await User.find({ "bookings.showId": { $in: showIds } }, "email");
  await sendEmailToUsers(users, title, message);

  res.status(200).json({
    success: true,
    message: `Notification sent to users interested in ${movie.title}`,
    data: notification,
  });
});

// send notification to users of a specific venue
export const sendNotificationToVenueFollowers = asyncHandler(async (req, res) => {
  const { venueId } = req.params;
  const { title, message } = req.body;

  const venue = await Venue.findById(venueId);
  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }

  const notification = await Notification.create({
    title,
    message,
    targetType: "VENUE",
    targetId: venueId,
    status: "sent",
    createdBy: req.user._id,
  });

  // Find users who booked at this venue
  const shows = await Show.find({ venue: venueId }, "_id");
  const showIds = shows.map(s => s._id);
  const users = await User.find({ "bookings.showId": { $in: showIds } }, "email");
  await sendEmailToUsers(users, title, message);

  res.status(200).json({
    success: true,
    message: `Notification sent to users at ${venue.name}`,
    data: notification,
  });
});

// send notification about a new show
export const sendNotificationToShowAttendees = asyncHandler(async (req, res) => {
  const { showId } = req.params;
  const show = await Show.findById(showId).populate('movie').populate('venue');

  if (!show) {
    throw new ApiError(404, "Show not found");
  }

  const notification = await Notification.create({
    title: "New Show Added",
    message: `${show.movie.title} at ${show.venue.name} on ${new Date(show.showDateTime).toLocaleString()}`,
    targetType: "ALL",
    status: "sent",
    createdBy: req.user._id,
  });

  // Notify all users (or you can filter for interested users)
  const users = await User.find({}, "email");
  await sendEmailToUsers(users, "New Show Added", notification.message);

  res.status(200).json({
    success: true,
    message: `Notification sent about ${show.movie.title}`,
    data: notification,
  });
});

// schedule notification (optional)
export const scheduleNotification = asyncHandler(async (req, res) => {
  const { title, message, targetType, targetId, scheduledFor } = req.body;

  const notification = await Notification.create({
    title,
    message,
    targetType,
    targetId,
    status: "scheduled",
    scheduledFor: new Date(scheduledFor),
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Notification scheduled successfully",
    data: notification,
  });
});

// get all notifications
export const getAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find()
    .populate('createdBy', 'fullName email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: notifications,
  });
});

