import { ApiError } from "../../../utils/ApiError.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import Venue from "../../models/venue.models.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

// get all active venues
export const getAllVenues = asyncHandler(async (req, res) => {
    const venues = await Venue.find({ isActive: true });
    
    if (!venues || venues.length === 0) {
        throw new ApiError(404, "No venues found");
    }
    
    return res.status(200).json(new ApiResponse(200, "Venues fetched successfully", venues));
});

// get venues by city
export const getVenuesByCity = asyncHandler(async (req, res) => {
    const { city } = req.query;
    
    if (!city) {
        throw new ApiError(400, "City parameter is required");
    }
    
    const venues = await Venue.find({ 
        city: { $regex: city, $options: 'i' }, 
        isActive: true 
    });
    
    if (!venues || venues.length === 0) {
        throw new ApiError(404, "No venues found in this city");
    }
    
    return res.status(200).json(new ApiResponse(200, "Venues fetched successfully", venues));
});

// get venue details by ID
export const getVenueDetails = asyncHandler(async (req, res) => {
    const { venueId } = req.params;
    const venue = await Venue.findById(venueId);
    
    if (!venue) {
        throw new ApiError(404, "Venue not found");
    }
    
    return res.status(200).json(new ApiResponse(200, "Venue details fetched successfully", venue));
});

// search venues by name or city
export const searchVenues = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const filter = { isActive: true };
    
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } }
        ];
    }
    
    const venues = await Venue.find(filter);
    
    if (!venues || venues.length === 0) {
        throw new ApiError(404, "No venues found");
    }
    
    return res.status(200).json(new ApiResponse(200, "Venues fetched successfully", venues));
});






