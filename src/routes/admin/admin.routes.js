import { Router } from "express";
import { verifyAdminJWT } from "../../middlewares/auth/auth.middlewares.js";

// Movie controllers
import {
  createMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  toggleMovieStatus,
  bulkDeleteMovies,
} from "../../controllers/admin/movie.controllers.js";

// Venue controllers
import {
  createVenue,
  updateVenue,
  deleteVenue,
  getAllVenues,
  getVenueById,
  toggleVenueStatus,
  bulkToggleVenues,
} from "../../controllers/admin/venue.controllers.js";

// Show controllers
import {
  createShow,
  updateShow,
  deleteShow,
  getNowPlayingShows,
  cancelShow,
  completeShow,
  bulkCancelShows,
} from "../../controllers/admin/show.controllers.js";

// User controllers
import {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  deleteUser,
  bulkToggleBlockUsers,
} from "../../controllers/admin/user.controllers.js";

// Dashboard controllers
import { getDashboardStats } from "../../controllers/admin/dashboard.controllers.js";

// Notification controllers
import {
  sendNotificationToAll,
  sendNotificationToMovieWatchers,
  sendNotificationToVenueFollowers,
  sendNotificationToShowAttendees,
  scheduleNotification,
  getAllNotifications,
} from "../../controllers/admin/notification.controllers.js";

// Offers controllers
import {
  createOffer,
  updateOffer,
  deleteOffer,
  getAllOffers as getAllOffersAdmin,
} from "../../controllers/admin/offer.controllers.js";

// Restaurant controllers
import {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurants as getAllRestaurantsAdmin,
} from "../../controllers/admin/restaurant.controllers.js";

// OTT controllers
import {
  createOTT,
  updateOTT,
  deleteOTT,
  getAllOTT as getAllOTTAdmin,
} from "../../controllers/admin/ott.controllers.js";

const router = Router();

// Apply admin middleware to all routes
router.use(verifyAdminJWT);

// ============ DASHBOARD ROUTES ============
router.get("/dashboard/stats", getDashboardStats);

// ============ MOVIE ROUTES ============
router.post("/movies", createMovie);
router.get("/movies", getAllMovies);
router.get("/movies/:movieId", getMovieById);
router.put("/movies/:movieId", updateMovie);
router.delete("/movies/:movieId", deleteMovie);
router.patch("/movies/:movieId/toggle", toggleMovieStatus);
router.post("/movies/bulk-delete", bulkDeleteMovies);

// ============ VENUE ROUTES ============
router.post("/venues", createVenue);
router.get("/venues", getAllVenues);
router.get("/venues/:venueId", getVenueById);
router.put("/venues/:venueId", updateVenue);
router.delete("/venues/:venueId", deleteVenue);
router.patch("/venues/:venueId/toggle", toggleVenueStatus);
router.post("/venues/bulk-toggle", bulkToggleVenues);

// ============ SHOW ROUTES ============
router.post("/shows", createShow);
router.get("/shows/now-playing", getNowPlayingShows);
router.put("/shows/:showId", updateShow);
router.delete("/shows/:showId", deleteShow);
router.patch("/shows/:showId/cancel", cancelShow);
router.patch("/shows/:showId/complete", completeShow);
router.post("/shows/bulk-cancel", bulkCancelShows);

// ============ USER MANAGEMENT ROUTES ============
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.patch("/users/:userId/block", blockUser);
router.patch("/users/:userId/unblock", unblockUser);
router.delete("/users/:userId", deleteUser);
router.post("/users/bulk-toggle-block", bulkToggleBlockUsers);

// ============ NOTIFICATION ROUTES ============
router.post("/notifications/all", sendNotificationToAll);
router.post("/notifications/movie/:movieId", sendNotificationToMovieWatchers);
router.post("/notifications/venue/:venueId", sendNotificationToVenueFollowers);
router.post("/notifications/show/:showId", sendNotificationToShowAttendees);
router.post("/notifications/schedule", scheduleNotification);
router.get("/notifications", getAllNotifications);

// ============ OFFERS ROUTES ============
router.post("/offers", createOffer);
router.get("/offers", getAllOffersAdmin);
router.put("/offers/:offerId", updateOffer);
router.delete("/offers/:offerId", deleteOffer);

// ============ RESTAURANT ROUTES ============
router.post("/restaurants", createRestaurant);
router.get("/restaurants", getAllRestaurantsAdmin);
router.put("/restaurants/:restaurantId", updateRestaurant);
router.delete("/restaurants/:restaurantId", deleteRestaurant);

// ============ OTT ROUTES ============
router.post("/ott", createOTT);
router.get("/ott", getAllOTTAdmin);
router.put("/ott/:ottId", updateOTT);
router.delete("/ott/:ottId", deleteOTT);

export default router;


