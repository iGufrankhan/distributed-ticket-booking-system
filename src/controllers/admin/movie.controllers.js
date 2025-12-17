import {ApiError} from "../../../utils/ApiError.js";
import {asyncHandler} from "../../../utils/AsyncHandler.js";
import {Movie} from "../../models/movie.models.js";
import {ApiResponse} from "../../../utils/ApiResponse.js";




// create movie
export const createMovie = asyncHandler(async (req, res) => {
    const {
        title,  
        overview,
        posterPath,
        backdropPath,
        releaseDate,
        originalLanguage,
        availabilityLanguages,
        tagline,    
        genres,
        casts,
        voteAverage,
        runtime,
        trailerUrl,
        rating,
        reviewCount

    } = req.body;



    const movie = await Movie.create({
        title,
        overview,
        posterPath,
        backdropPath,
        releaseDate,
        originalLanguage,
        availabilityLanguages,
        tagline,
        genres,
        casts,
        voteAverage,
        runtime,
        trailerUrl,
        rating,
        reviewCount,
        createdBy: req.admin._id,
        status: "active",
    });

    return res.status(201).json(new ApiResponse(true, "Movie created successfully", movie));
});


// update movie
export const updateMovie = asyncHandler(async (req, res) => {
    const {movieId} = req.params;
    const movieData = req.body;
    const movie = await Movie.findByIdAndUpdate(movieId, movieData, {
        new: true,
        runValidators: true,
    });
    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }
    return res.status(200).json(new ApiResponse(true, "Movie updated successfully", movie));
});

// delete movie
export const deleteMovie = asyncHandler(async (req, res) => {
    const {movieId} = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }
    await Movie.findByIdAndDelete(movieId);
    return res.status(200).json(new ApiResponse(true, "Movie deleted successfully"));
}
);

// Get all movies with filters
export const getAllMovies = asyncHandler(async (req, res) => {
    const { search, genre, language, isActive } = req.query;
    
    let filter = {};
    
    // Search by title
    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }
    
    // Filter by genre
    if (genre) {
        filter.genre = { $regex: genre, $options: 'i' };
    }
    
    // Filter by language
    if (language) {
        filter.language = { $regex: language, $options: 'i' };
    }
    
    // Filter by active status
    if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
    }
    
    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({ 
        success: true, 
        count: movies.length,
        data: movies 
    });
});

// get movie by id
export const getMovieById = asyncHandler(async (req, res) => {
    const {movieId} = req.params;
    const movie = await Movie.findById(movieId);

    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }       
    return res.status(200).json(new ApiResponse(true, "Movie fetched successfully", movie));
}
);

// toggle movie status (active/inactive)
export const toggleMovieStatus = asyncHandler(async (req, res) => {
    const {movieId} = req.params;
    const movie = await Movie.findById(movieId);
    
    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }
    
    movie.status = movie.status === "active" ? "inactive" : "active";
    await movie.save();
    
    return res.status(200).json(new ApiResponse(true, `Movie ${movie.status === 'active' ? 'activated' : 'deactivated'} successfully`, movie));
});

// Bulk delete movies
export const bulkDeleteMovies = asyncHandler(async (req, res) => {
    const { movieIds } = req.body;

    if (!Array.isArray(movieIds) || movieIds.length === 0) {
        throw new ApiError(400, "movieIds must be a non-empty array");
    }

    const result = await Movie.deleteMany({ _id: { $in: movieIds } });

    res.status(200).json({
        success: true,
        message: "Movies deleted successfully",
        data: {
            deletedCount: result.deletedCount,
        },
    });
});



