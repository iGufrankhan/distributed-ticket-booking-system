import { ApiError } from "../../../utils/ApiError.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { Restaurant } from "../../models/restaurant.models.js";

// Get all restaurants with filters
export const getRestaurants = asyncHandler(async (req, res) => {
  const { city, cuisine, rating, search } = req.query;
  
  let filter = {};
  
  if (city) filter.city = { $regex: city, $options: 'i' };
  if (cuisine) filter.cuisine = { $regex: cuisine, $options: 'i' };
  if (rating) filter.rating = { $gte: Number(rating) };
  if (search) filter.name = { $regex: search, $options: 'i' };
  
  const restaurants = await Restaurant.find(filter).sort({ rating: -1 });
  
  return res.status(200).json(new ApiResponse(200, "Restaurants fetched successfully", restaurants));
});

// Get restaurant by ID
export const getRestaurantById = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  
  const restaurant = await Restaurant.findById(restaurantId);
  
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }
  
  return res.status(200).json(new ApiResponse(200, "Restaurant fetched successfully", restaurant));
});

// Get restaurants by city
export const getRestaurantsByCity = asyncHandler(async (req, res) => {
  const { city } = req.params;
  
  const restaurants = await Restaurant.find({ 
    city: { $regex: city, $options: 'i' } 
  }).sort({ rating: -1 });
  
  if (!restaurants || restaurants.length === 0) {
    throw new ApiError(404, "No restaurants found in this city");
  }
  
  return res.status(200).json(new ApiResponse(200, "Restaurants fetched successfully", restaurants));
});

// Get top rated restaurants
export const getTopRatedRestaurants = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const restaurants = await Restaurant.find()
    .sort({ rating: -1 })
    .limit(Number(limit));
  
  return res.status(200).json(new ApiResponse(200, "Top restaurants fetched successfully", restaurants));
});
