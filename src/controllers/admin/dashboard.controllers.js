import {ApiError} from "../../../utils/ApiError.js";
import {asyncHandler} from "../../../utils/AsyncHandler.js";
import { Show } from "../../models/show.models.js";
import { Movie } from "../../models/movie.models.js";
import Venue from "../../models/venue.models.js";
import { User } from "../../models/user.models.js";

// get dashboard stats
export const getDashboardStats = asyncHandler(async (req, res) => {
    const totalMovies = await Movie.countDocuments();
    const totalVenues = await Venue.countDocuments();
    const totalShows = await Show.countDocuments();
    const activeShows = await Show.countDocuments({ status: "scheduled" });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    res.status(200).json({
        success: true,
        data: {
            totalMovies,
            totalVenues,
            totalShows,
            activeShows,
            blockedUsers,
        },
    });
});

// Additional admin dashboard controllers can be added here
