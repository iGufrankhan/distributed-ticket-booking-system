import {ApiError} from "../../../utils/ApiError.js";
import {asyncHandler} from "../../../utils/AsyncHandler.js";
import { Show } from "../../models/show.models.js";
import { Movie } from "../../models/movie.models.js";
import Venue from "../../models/venue.models.js";

// create show
export const createShow = asyncHandler(async (req, res) => {
    const { movieid, venueid, showDateTime, showPrice, totalSeats } = req.body;
    
    // Check if movie exists
    const movie = await Movie.findById(movieid);
    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }

    // Check if venue exists
    const venue = await Venue.findById(venueid);
    if (!venue) {
        throw new ApiError(404, "Venue not found");
    }

    const show = await Show.create({ 
        movie: movieid,
        venue: venueid,
        showDateTime,
        showPrice,
        totalSeats,
        availableSeats: totalSeats,
        occupiedSeats: {},   
        createdBy: req.admin._id,
        status: "scheduled",
    });
    
    res.status(201).json({ success: true, data: show });
});

// update show
export const updateShow = asyncHandler(async (req, res) => {
    const { showId } = req.params;
    const showData = req.body;
    
    const show = await Show.findByIdAndUpdate(showId, showData, {
        new: true,
        runValidators: true,
    });
    
    if (!show) {
        throw new ApiError(404, "Show not found");
    }
    
    res.status(200).json({ success: true, data: show });
});

// delete show
export const deleteShow = asyncHandler(async (req, res) => {
    const { showId } = req.params;
    const show = await Show.findById(showId);
    
    if (!show) {
        throw new ApiError(404, "Show not found");
    }
    
    await Show.findByIdAndDelete(showId);
    res.status(200).json({ success: true, message: "Show deleted successfully" });
});

// get now playing shows with filters
export const getNowPlayingShows = asyncHandler(async (req, res) => {
    const { movie, venue, date, status } = req.query;
    const currentDate = new Date();
    
    let filter = {
        showDateTime: { $gte: currentDate },
        status: status || "scheduled"
    };
    
    // Filter by movie
    if (movie) {
        filter.movie = movie;
    }
    
    // Filter by venue
    if (venue) {
        filter.venue = venue;
    }
    
    // Filter by specific date
    if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        filter.showDateTime = { 
            $gte: startOfDay, 
            $lte: endOfDay 
        };
    }
    
    const shows = await Show.find(filter)
        .populate('movie')
        .populate('venue')
        .sort({ showDateTime: 1 });

    res.status(200).json({ 
        success: true, 
        count: shows.length,
        data: shows 
    });
});

// cancel show
export const cancelShow = asyncHandler(async (req, res) => {
    const { showId } = req.params;
    const show = await Show.findById(showId);
    
    if (!show) {
        throw new ApiError(404, "Show not found");
    }
    
    show.status = "cancelled";
    await show.save();
    res.status(200).json({ success: true, data: show });
});

// complete show
export const completeShow = asyncHandler(async (req, res) => {
    const { showId } = req.params;
    const show = await Show.findById(showId);
    
    if (!show) {
        throw new ApiError(404, "Show not found");
    }
    
    show.status = "completed";
    await show.save();
    res.status(200).json({ success: true, data: show });
});

// bulk cancel shows
export const bulkCancelShows = asyncHandler(async (req, res) => {
    const { showIds, reason } = req.body;

    // Validation
    if (!Array.isArray(showIds) || showIds.length === 0) {
        throw new ApiError(400, "showIds must be a non-empty array");
    }

    // Update only scheduled shows
    const result = await Show.updateMany(
        {
            _id: { $in: showIds },
            status: "scheduled",
        },
        {
            $set: {
                status: "cancelled",
                cancelReason: reason || "Cancelled by admin",
            },
        }
    );

    res.status(200).json({
        success: true,
        message: "Shows cancelled successfully",
        data: {
            matched: result.matchedCount,
            cancelled: result.modifiedCount,
        },
    });
});