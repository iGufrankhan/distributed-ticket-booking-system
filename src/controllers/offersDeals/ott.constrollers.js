import { ApiError } from "../../../utils/ApiError.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { OTT } from "../../models/ott.models.js";

// Get all OTT content with filters
export const getOTTContent = asyncHandler(async (req, res) => {
  const { platform, genre, language, contentType, search } = req.query;
  
  let filter = {};
  
  if (platform) filter.platform = platform;
  if (genre) filter.genre = { $regex: genre, $options: 'i' };
  if (language) filter.language = language;
  if (contentType) filter.contentType = contentType; // movie, series, documentary
  if (search) filter.title = { $regex: search, $options: 'i' };
  
  const content = await OTT.find(filter).sort({ releaseDate: -1 });
  
  return res.status(200).json(new ApiResponse(200, "OTT content fetched successfully", content));
});

// Get OTT content by ID
export const getOTTById = asyncHandler(async (req, res) => {
  const { ottId } = req.params;
  
  const content = await OTT.findById(ottId);
  
  if (!content) {
    throw new ApiError(404, "Content not found");
  }
  
  return res.status(200).json(new ApiResponse(200, "Content fetched successfully", content));
});

// Get content by platform (Netflix, Prime, Hotstar, etc.)
export const getContentByPlatform = asyncHandler(async (req, res) => {
  const { platform } = req.params;
  
  const content = await OTT.find({ platform }).sort({ releaseDate: -1 });
  
  if (!content || content.length === 0) {
    throw new ApiError(404, "No content found for this platform");
  }
  
  return res.status(200).json(new ApiResponse(200, "Content fetched successfully", content));
});

// Get trending OTT content
export const getTrendingOTT = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;
  
  const content = await OTT.find()
    .sort({ views: -1, rating: -1 })
    .limit(Number(limit));
  
  return res.status(200).json(new ApiResponse(200, "Trending content fetched successfully", content));
});

// Get new releases
export const getNewReleases = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const content = await OTT.find({ 
    releaseDate: { $gte: thirtyDaysAgo } 
  })
    .sort({ releaseDate: -1 })
    .limit(Number(limit));
  
  return res.status(200).json(new ApiResponse(200, "New releases fetched successfully", content));
});

// Get recommended content
export const getRecommendedOTT = asyncHandler(async (req, res) => {
  const { genre, language } = req.query;
  
  let filter = { rating: { $gte: 7 } }; // Only highly rated content
  
  if (genre) filter.genre = { $regex: genre, $options: 'i' };
  if (language) filter.language = language;
  
  const content = await OTT.find(filter)
    .sort({ rating: -1, views: -1 })
    .limit(15);
  
  return res.status(200).json(new ApiResponse(200, "Recommended content fetched successfully", content));
});
