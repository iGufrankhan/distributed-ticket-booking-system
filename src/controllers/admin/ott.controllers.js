import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { OTT } from "../../models/ott.models.js";

// Create OTT content
export const createOTT = asyncHandler(async (req, res) => {
  const ott = await OTT.create({
    ...req.body,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, ott, "OTT content created successfully"));
});

// Get all OTT content
export const getAllOTT = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, platform, genre, contentType } = req.query;

  const filter = {};
  if (platform) filter.platform = platform;
  if (genre) filter.genre = genre;
  if (contentType) filter.contentType = contentType;

  const ottContent = await OTT.find(filter)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await OTT.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ottContent,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
      "OTT content fetched successfully"
    )
  );
});

// Update OTT content
export const updateOTT = asyncHandler(async (req, res) => {
  const { ottId } = req.params;

  const ott = await OTT.findByIdAndUpdate(ottId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!ott) {
    throw new ApiError(404, "OTT content not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, ott, "OTT content updated successfully"));
});

// Delete OTT content
export const deleteOTT = asyncHandler(async (req, res) => {
  const { ottId } = req.params;

  const ott = await OTT.findByIdAndDelete(ottId);

  if (!ott) {
    throw new ApiError(404, "OTT content not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTT content deleted successfully"));
});