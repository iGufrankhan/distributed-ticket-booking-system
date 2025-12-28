import { Router } from "express";
import {
  deleteMovie,
  getAllMovies,
  getMovieById,
  registerMovie,
  updateMovie,
  getAllTheaters,
  getTheaterById,
  registerTheater,
  updateTheater,
  deleteTheater,
} from "../controllers/admin/admin.controllers.js";
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
} from "../controllers/admin/queue.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyJWT, isAdmin);

// Movie routes
router.post("/movies", registerMovie);
router.get("/movies", getAllMovies);
router.get("/movies/:id", getMovieById);
router.patch("/movies/:id", updateMovie);
router.delete("/movies/:id", deleteMovie);

// Theater routes
router.post("/theaters", registerTheater);
router.get("/theaters", getAllTheaters);
router.get("/theaters/:id", getTheaterById);
router.patch("/theaters/:id", updateTheater);
router.delete("/theaters/:id", deleteTheater);

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
router.delete("/queue/empty", emptyQueue); // DANGEROUS

export default router;