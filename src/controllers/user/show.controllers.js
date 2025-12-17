import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";
import { Show } from "../../models/show.models.js";
import Venue from "../../models/venue.models.js";

// get all shows
export const getAllShows = asyncHandler(async (req, res) => {
    const shows = await Show.find({ status: "scheduled" })
        .populate('movie')
        .populate('venue')
        .sort({ showDateTime: 1 });
    
    if (!shows || shows.length === 0) {
        throw new ApiError(404, "No shows found");
    }
    
    return res.status(200).json(new ApiResponse(200, "Shows fetched successfully", shows));
});

// get show by id
export const getShowById = asyncHandler(async (req, res) => {
    const { showId } = req.params;
    
    const show = await Show.findById(showId)
        .populate('movie')
        .populate('venue');
    
    if (!show) {
        throw new ApiError(404, "Show not found");
    }
    
    return res.status(200).json(new ApiResponse(200, "Show fetched successfully", show));
});

// get shows by venue and city
export const getShowsByVenueAndCity = asyncHandler(async (req, res) => {
    const { venueId, city } = req.query;
    
    let filter = { status: "scheduled" };
    
    // If venueId provided, filter by venue
    if (venueId) {
        filter.venue = venueId;
    }
    
    // If city provided, find venues in that city first
    if (city) {
        const venues = await Venue.find({ 
            city: { $regex: city, $options: 'i' },
            isActive: true 
        });
        
        if (!venues || venues.length === 0) {
            throw new ApiError(404, "No venues found in this city");
        }
        
        const venueIds = venues.map(v => v._id);
        filter.venue = { $in: venueIds };
    }
    
    const shows = await Show.find(filter)
        .populate('movie')
        .populate('venue')
        .sort({ showDateTime: 1 });
    
    if (!shows || shows.length === 0) {
        throw new ApiError(404, "No shows found");
    }
    
    return res.status(200).json(new ApiResponse(200, "Shows fetched successfully", shows));
});

// get shows by movie
export const getShowsByMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    
    const shows = await Show.find({ 
        movie: movieId,
        status: "scheduled"
    })
        .populate('movie')
        .populate('venue')
        .sort({ showDateTime: 1 });
    
    if (!shows || shows.length === 0) {
        throw new ApiError(404, "No shows found for this movie");
    }
    
    return res.status(200).json(new ApiResponse(200, "Shows fetched successfully", shows));
});

