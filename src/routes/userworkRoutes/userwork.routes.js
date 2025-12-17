import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth/auth.middlewares.js";

// Profile controllers
import { 
    getUserprofile, 
    updateUserProfile, 
    deleteUserProfile 
} from "../../controllers/user/profile.controllers.js";

// Movie controllers
import { 
    getAllMovies, 
    getMovieById, 
    searchMovies 
} from "../../controllers/user/movie.controllers.js";

// Venue controllers
import { 
    getAllVenues, 
    getVenuesByCity, 
    getVenueDetails, 
    searchVenues 
} from "../../controllers/user/venue.controllers.js";

// Show controllers
import { 
    getAllShows, 
    getShowById, 
    getShowsByVenueAndCity, 
    getShowsByMovie 
} from "../../controllers/user/show.controllers.js";

// Order controllers
import { 
    getUserOrders, 
    getOrderById 
} from "../../controllers/user/order.controllers.js";

// Offers & Deals controllers
import { 
    getOffers, 
    getOfferById, 
    getOffersByCategory, 
    getTrendingOffers, 
    useCoupon 
} from "../../controllers/offersDeals/offer.controllers.js";

import { 
    getRestaurants, 
    getRestaurantById, 
    getRestaurantsByCity, 
    getTopRatedRestaurants 
} from "../../controllers/offersDeals/resturants.controllers.js";

import { 
    getOTTContent, 
    getOTTById, 
    getContentByPlatform, 
    getTrendingOTT, 
    getNewReleases, 
    getRecommendedOTT 
} from "../../controllers/offersDeals/ott.constrollers.js";

const router = Router();

// ============ PROFILE ROUTES ============
router.get("/profile", verifyJWT, getUserprofile);
router.put("/profile", verifyJWT, updateUserProfile);
router.delete("/profile", verifyJWT, deleteUserProfile);

// ============ MOVIE ROUTES ============
router.get("/movies", getAllMovies);
router.get("/movies/search", searchMovies);
router.get("/movies/:movieId", getMovieById);

// ============ VENUE ROUTES ============
router.get("/venues", getAllVenues);
router.get("/venues/search", searchVenues);
router.get("/venues/city/:city", getVenuesByCity);
router.get("/venues/:venueId", getVenueDetails);

// ============ SHOW ROUTES ============
router.get("/shows", getAllShows);
router.get("/shows/filter", getShowsByVenueAndCity);
router.get("/shows/movie/:movieId", getShowsByMovie);
router.get("/shows/:showId", getShowById);

// ============ ORDER ROUTES ============
router.get("/orders", verifyJWT, getUserOrders);
router.get("/orders/:orderId", verifyJWT, getOrderById);

// ============ OFFERS & DEALS ROUTES ============
router.get("/offers", getOffers);
router.get("/offers/trending", getTrendingOffers);
router.get("/offers/category/:category", getOffersByCategory);
router.get("/offers/:offerId", getOfferById);
router.post("/offers/:offerId/use", verifyJWT, useCoupon);

// ============ RESTAURANT ROUTES ============
router.get("/restaurants", getRestaurants);
router.get("/restaurants/top-rated", getTopRatedRestaurants);
router.get("/restaurants/city/:city", getRestaurantsByCity);
router.get("/restaurants/:restaurantId", getRestaurantById);

// ============ OTT ROUTES ============
router.get("/ott", getOTTContent);
router.get("/ott/trending", getTrendingOTT);
router.get("/ott/new-releases", getNewReleases);
router.get("/ott/recommended", getRecommendedOTT);
router.get("/ott/platform/:platform", getContentByPlatform);
router.get("/ott/:ottId", getOTTById);

export default router;