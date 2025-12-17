import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { Movie } from "../../models/movie.models.js";
import { ApiError } from "../../../utils/ApiError.js";

// get all movies
export const getAllMovies = asyncHandler(async (req, res) => {
    const movies = await Movie.find({ isActive: true });

    if (!movies || movies.length === 0) {
        throw new ApiError(404, "No movies found");
    }
    
    return res.status(200).json(new ApiResponse(200, "Movies fetched successfully", movies));
});

// get movie by id
export const getMovieById = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    
    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }
    
    return res.status(200).json(new ApiResponse(200, "Movie fetched successfully", movie));
});

// search movies by language, genre, or city
export const searchMovies = asyncHandler(async (req, res) => {
    const { language, genre, city, search } = req.query;
    
    const filter = { isActive: true };
    
    if (language) filter.language = language;
    if (genre) filter.genre = genre;
    if (city) filter.cities = city;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const movies = await Movie.find(filter);
    
    if (!movies || movies.length === 0) {
        throw new ApiError(404, "No movies found");
    }
    
    return res.status(200).json(new ApiResponse(200, "Movies fetched successfully", movies));
});


