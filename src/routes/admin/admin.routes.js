import { Router } from "express";
import { getDashboardStats } from "../../controllers/admin/dashboard.controllers.js";
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
    createMovie, 
    updateMovie, 
    deleteMovie, 
    toggleMovieStatus, 
    getAllMovies,
    bulkDeleteMovies 
} from "../../controllers/admin/movie.controllers.js";
import { 
    createVenue, 
    updateVenue, 
    deleteVenue, 
    toggleVenueStatus, 
    getAllVenues,
    getVenueById,
    bulkToggleVenues 
} from "../../controllers/admin/venue.controllers.js";
import { 
    getAllUsers, 
    getUserById, 
    blockUser, 
    unblockUser,
    bulkToggleBlockUsers 
} from "../../controllers/admin/user.controllers.js";
import { 
    sendNotificationToAll, 
    sendNotificationByMovie, 
    sendNotificationByVenue,
    notifyUsersAboutNewShow,
    scheduleNotification,
    getAllNotifications
} from "../../controllers/admin/notification.controllers.js";
import { verifyAdminJWT } from "../../middlewares/auth/auth.middlewares.js";
import { validate } from "../../middlewares/limiterandverify/validate.middleware.js";
import { createShowSchema, updateShowSchema } from "../../validations/admin/show.validations.js";
import { notificationSchema } from "../../validations/admin/notification.validations.js";

const router = Router();

// ============ DASHBOARD ROUTES ============
router.get("/dashboard/stats", verifyAdminJWT, getDashboardStats);

// ============ MOVIE ROUTES ============
router.post("/movies", verifyAdminJWT, createMovie);
router.get("/movies", verifyAdminJWT, getAllMovies); // Now supports filters
router.put("/movies/:movieId", verifyAdminJWT, updateMovie);
router.delete("/movies/:movieId", verifyAdminJWT, deleteMovie);
router.patch("/movies/:movieId/toggle", verifyAdminJWT, toggleMovieStatus);
router.post("/movies/bulk-delete", verifyAdminJWT, bulkDeleteMovies); // NEW

// ============ VENUE ROUTES ============
router.post("/venues", verifyAdminJWT, createVenue);
router.get("/venues", verifyAdminJWT, getAllVenues);
router.get("/venues/:venueId", verifyAdminJWT, getVenueById);
router.put("/venues/:venueId", verifyAdminJWT, updateVenue);
router.delete("/venues/:venueId", verifyAdminJWT, deleteVenue);
router.patch("/venues/:venueId/toggle", verifyAdminJWT, toggleVenueStatus);
router.post("/venues/bulk-toggle", verifyAdminJWT, bulkToggleVenues); // NEW

// ============ SHOW ROUTES ============
router.post("/shows", verifyAdminJWT, validate(createShowSchema), createShow);
router.get("/shows/now-playing", verifyAdminJWT, getNowPlayingShows); // Now supports filters
router.put("/shows/:showId", verifyAdminJWT, validate(updateShowSchema), updateShow);
router.delete("/shows/:showId", verifyAdminJWT, deleteShow);
router.patch("/shows/:showId/cancel", verifyAdminJWT, cancelShow);
router.patch("/shows/:showId/complete", verifyAdminJWT, completeShow);
router.post("/shows/bulk-cancel", verifyAdminJWT, bulkCancelShows);

// ============ USER ROUTES ============
router.get("/users", verifyAdminJWT, getAllUsers);
router.get("/users/:userId", verifyAdminJWT, getUserById);
router.patch("/users/:userId/block", verifyAdminJWT, blockUser);
router.patch("/users/:userId/unblock", verifyAdminJWT, unblockUser);
router.post("/users/bulk-toggle-block", verifyAdminJWT, bulkToggleBlockUsers); // NEW

// ============ NOTIFICATION ROUTES ============
router.post("/notifications/all", verifyAdminJWT, validate(notificationSchema), sendNotificationToAll);
router.post("/notifications/movie/:movieId", verifyAdminJWT, validate(notificationSchema), sendNotificationByMovie);
router.post("/notifications/venue/:venueId", verifyAdminJWT, validate(notificationSchema), sendNotificationByVenue);
router.post("/notifications/show/:showId", verifyAdminJWT, notifyUsersAboutNewShow);
router.post("/notifications/schedule", verifyAdminJWT, scheduleNotification);
router.get("/notifications", verifyAdminJWT, getAllNotifications);

export default router;


