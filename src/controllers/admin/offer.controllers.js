import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { Offer } from "../../models/offer.models.js";

// Create offer
export const createOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.create({
    ...req.body,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, offer, "Offer created successfully"));
});

// Get all offers
export const getAllOffers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, isActive } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === "true";

  const offers = await Offer.find(filter)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Offer.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        offers,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
      "Offers fetched successfully"
    )
  );
});

// Update offer
export const updateOffer = asyncHandler(async (req, res) => {
  const { offerId } = req.params;

  const offer = await Offer.findByIdAndUpdate(offerId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!offer) {
    throw new ApiError(404, "Offer not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, offer, "Offer updated successfully"));
});

// Delete offer
export const deleteOffer = asyncHandler(async (req, res) => {
  const { offerId } = req.params;

  const offer = await Offer.findByIdAndDelete(offerId);

  if (!offer) {
    throw new ApiError(404, "Offer not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Offer deleted successfully"));
});