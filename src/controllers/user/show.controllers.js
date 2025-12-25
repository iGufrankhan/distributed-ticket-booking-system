import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { Show } from "../../models/show.models.js";

// Get all shows
export const getAllShows = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const shows = await Show.find({ status: "active" })
    .populate("movie", "title posterPath runtime rating")
    .populate("venue", "name city address")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ showTime: 1 });

  const count = await Show.countDocuments({ status: "active" });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        shows,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
      "Shows fetched successfully"
    )
  );
});

// Get show by ID
export const getShowById = asyncHandler(async (req, res) => {
  const { showId } = req.params;

  const show = await Show.findById(showId)
    .populate("movie", "title overview posterPath runtime rating genres")
    .populate("venue", "name city address screens amenities contactNumber");

  if (!show) {
    throw new ApiError(404, "Show not found");
  }

  return res.status(200).json(new ApiResponse(200, show, "Show fetched successfully"));
});

// Get shows by venue and city (filter)
export const getShowsByVenueAndCity = asyncHandler(async (req, res) => {
  const { venue, city } = req.query;

  const filter = { status: "active" };

  if (venue) filter.venue = venue;

  const shows = await Show.find(filter)
    .populate("movie", "title posterPath runtime rating")
    .populate({
      path: "venue",
      match: city ? { city: new RegExp(city, "i") } : {},
      select: "name city address",
    })
    .sort({ showTime: 1 });

  // Filter out shows where venue didn't match city
  const filteredShows = shows.filter(show => show.venue);

  return res.status(200).json(
    new ApiResponse(200, filteredShows, "Shows fetched successfully")
  );
});

// Get shows by movie - THIS WILL SHOW ALL VENUES FOR SAME MOVIE ✅
export const getShowsByMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { city, date, page = 1, limit = 20 } = req.query;

  const filter = {
    movie: movieId,
    status: "active",
  };

  // Filter by date if provided
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    filter.showTime = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  // Build query
  let query = Show.find(filter)
    .populate("movie", "title posterPath runtime rating genres language")
    .populate("venue", "name city address screens amenities contactNumber location");

  // Filter by city if provided
  if (city) {
    const shows = await query;
    const filteredShows = shows.filter(
      show => show.venue && show.venue.city.toLowerCase() === city.toLowerCase()
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          shows: filteredShows,
          total: filteredShows.length,
          movie: filteredShows[0]?.movie || null,
        },
        "Shows fetched successfully"
      )
    );
  }

  // Pagination
  const shows = await query
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ showTime: 1 });

  const count = await Show.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        shows,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
        movie: shows[0]?.movie || null,
      },
      "Shows fetched successfully"
    )
  );
});

