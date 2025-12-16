import Venue from "../../models/venue.models.js";
import {ApiError} from "../../../utils/ApiError.js";
import {asyncHandler} from "../../../utils/AsyncHandler.js";

// create venue
export const createVenue = asyncHandler(async (req, res) => {
    const { name, city, address, totalSeats, seatLayout } = req.body;
    
    const venue = await Venue.create({ 
        name, 
        city, 
        address, 
        totalSeats, 
        seatLayout 
    });
    
    res.status(201).json({ success: true, data: venue });
});

// update venue
export const updateVenue = asyncHandler(async (req, res) => {
    const { venueId } = req.params;
    const venueData = req.body;
    
    const venue = await Venue.findByIdAndUpdate(venueId, venueData, {
        new: true,
        runValidators: true,
    });
    
    if (!venue) {
        throw new ApiError(404, "Venue not found");
    }
    
    res.status(200).json({ success: true, data: venue });
});

// delete venue
export const deleteVenue = asyncHandler(async (req, res) => {
    const { venueId } = req.params;
    const venue = await Venue.findById(venueId);
    
    if (!venue) {
        throw new ApiError(404, "Venue not found");
    }
    
    await Venue.findByIdAndDelete(venueId);
    res.status(200).json({ success: true, message: "Venue deleted successfully" });
});

// enable/disable venue
export const toggleVenueStatus = asyncHandler(async (req, res) => {
    const { venueId } = req.params;
    const venue = await Venue.findById(venueId);
    
    if (!venue) {
        throw new ApiError(404, "Venue not found");
    }
    
    venue.isActive = !venue.isActive;
    await venue.save();
    
    res.status(200).json({ 
        success: true, 
        message: `Venue ${venue.isActive ? 'enabled' : 'disabled'} successfully`,
        data: venue 
    });
});

// get all venues
export const getAllVenues = asyncHandler(async (req, res) => {
    const venues = await Venue.find();
    res.status(200).json({ success: true, data: venues });
});

// get venue by id
export const getVenueById = asyncHandler(async (req, res) => {
    const { venueId } = req.params;
    const venue = await Venue.findById(venueId);
    
    if (!venue) {
        throw new ApiError(404, "Venue not found");
    }
    
    res.status(200).json({ success: true, data: venue });
});

// Bulk enable/disable venues
export const bulkToggleVenues = asyncHandler(async (req, res) => {
    const { venueIds, isActive } = req.body;

    if (!Array.isArray(venueIds) || venueIds.length === 0) {
        throw new ApiError(400, "venueIds must be a non-empty array");
    }

    if (typeof isActive !== 'boolean') {
        throw new ApiError(400, "isActive must be a boolean");
    }

    const result = await Venue.updateMany(
        { _id: { $in: venueIds } },
        { $set: { isActive } }
    );

    res.status(200).json({
        success: true,
        message: `Venues ${isActive ? 'enabled' : 'disabled'} successfully`,
        data: {
            matched: result.matchedCount,
            modified: result.modifiedCount,
        },
    });
});



