import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { Restaurant } from "../../models/restaurant.models.js";

// Create restaurant
export const createRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.create({
    ...req.body,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, restaurant, "Restaurant created successfully"));
});

// Get all restaurants
export const getAllRestaurants = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, city, cuisine } = req.query;

  const filter = {};
  if (city) filter.city = new RegExp(city, "i");
  if (cuisine) filter.cuisine = cuisine;

  const restaurants = await Restaurant.find(filter)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ rating: -1 });

  const count = await Restaurant.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        restaurants,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
      "Restaurants fetched successfully"
    )
  );
});

// Update restaurant
export const updateRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, restaurant, "Restaurant updated successfully"));
});

// Delete restaurant
export const deleteRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findByIdAndDelete(restaurantId);

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Restaurant deleted successfully"));
});