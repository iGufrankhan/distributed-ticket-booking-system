import { Router } from "express";
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie
} from "../../controllers/admin/movie.controllers.js";
import {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue
} from "../../controllers/admin/venue.controllers.js";
import {
  getQueueStats,
  getFailedJobs,
  getActiveJobs,
  getWaitingJobs,
  getCompletedJobs,
  retryFailedJob,
  retryAllFailedJobs,
  removeJob,
  cleanQueue,
  pauseQueue,
  resumeQueue,
  getJobById,
  emptyQueue,
  getQueueHealth
} from "../../controllers/booking/queue.controllers.js";
import {
  sendNotificationToAll,
  sendNotificationToMovieWatchers,
  sendNotificationToVenueFollowers,
  sendNotificationToShowAttendees,
  scheduleNotification,
  getAllNotifications
} from "../../controllers/admin/notification.controllers.js";
import { verifyJWT } from "../../middlewares/auth/auth.middlewares.js";
import { sendNewsletterHandler } from "../../controllers/admin/newsletter.controllers.js";
import {
  createShow,
  updateShow,
  deleteShow,
  getNowPlayingShows,
  cancelShow,
  completeShow,
  bulkCancelShows
} from "../../controllers/admin/show.controllers.js";
import {
  addSeats,
  getSeatsForShow
} from "../../services/booking/seat.service.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyJWT);

// Movie routes
router.post("/movies", createMovie);
router.get("/movies", getAllMovies);
router.get("/movies/:id", getMovieById);
router.patch("/movies/:id", updateMovie);
router.delete("/movies/:id", deleteMovie);

// Venue routes
router.post("/venues", createVenue);
router.get("/venues", getAllVenues);
router.get("/venues/:id", getVenueById);
router.patch("/venues/:id", updateVenue);
router.delete("/venues/:id", deleteVenue);

// Queue monitoring routes
router.get("/queue/stats", getQueueStats);
router.get("/queue/health", getQueueHealth);
router.get("/queue/failed", getFailedJobs);
router.get("/queue/active", getActiveJobs);
router.get("/queue/waiting", getWaitingJobs);
router.get("/queue/completed", getCompletedJobs);
router.get("/queue/job/:jobId", getJobById);

// Queue management routes
router.post("/queue/retry/:jobId", retryFailedJob);
router.post("/queue/retry-all", retryAllFailedJobs);
router.delete("/queue/job/:jobId", removeJob);
router.post("/queue/clean", cleanQueue);
router.post("/queue/pause", pauseQueue);
router.post("/queue/resume", resumeQueue);
router.delete("/queue/empty", emptyQueue);

// Notification routes
router.post("/notifications/all", sendNotificationToAll);
router.post("/notifications/movie/:movieId", sendNotificationToMovieWatchers);
router.post("/notifications/venue/:venueId", sendNotificationToVenueFollowers);
router.post("/notifications/show/:showId", sendNotificationToShowAttendees);
router.post("/notifications/schedule", scheduleNotification);
router.get("/notifications", getAllNotifications);

// Newsletter routes
router.post("/newsletter/send", sendNewsletterHandler);

// Show routes
router.post("/shows", createShow);
router.put("/shows/:showId", updateShow);
router.delete("/shows/:showId", deleteShow);
router.get("/shows/now-playing", getNowPlayingShows);
router.patch("/shows/:showId/cancel", cancelShow);
router.patch("/shows/:showId/complete", completeShow);
router.post("/shows/bulk-cancel", bulkCancelShows);

// Seat management routes (admin)
router.post("/seats", addSeats); // Bulk add seats to a show
router.get("/seats/:showId", getSeatsForShow); // Get all seats for a show

export default router;


