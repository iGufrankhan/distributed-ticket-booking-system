import { ApiError } from "../../../utils/ApiError.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { Offer } from "../../models/offer.models.js";

// Get all offers with filters
export const getOffers = asyncHandler(async (req, res) => {
  const { category, offerType, isActive, search } = req.query;
  
  let filter = {};
  
  if (category) filter.category = category;
  if (offerType) filter.offerType = offerType;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { couponCode: { $regex: search, $options: "i" } }
    ];
  }

  // Filter by valid date
  const now = new Date();
  filter.validFrom = { $lte: now };
  filter.$or = [
    { validTill: { $gte: now } },
    { validUntil: { $gte: now } }
  ];

  const offers = await Offer.find(filter).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, offers, "Offers fetched successfully")
  );
});

// Get offer by ID
export const getOfferById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const offer = await Offer.findById(id);

  if (!offer) {
    throw new ApiError(404, "Offer not found");
  }

  return res.status(200).json(
    new ApiResponse(200, offer, "Offer fetched successfully")
  );
});

// Get trending offers
export const getTrendingOffers = asyncHandler(async (req, res) => {
  const now = new Date();

  const offers = await Offer.find({
    isActive: true,
    validFrom: { $lte: now },
    $or: [
      { validTill: { $gte: now } },
      { validUntil: { $gte: now } }
    ]
  })
    .sort({ usedCount: -1 })
    .limit(10);

  return res.status(200).json(
    new ApiResponse(200, offers, "Trending offers fetched successfully")
  );
});

// Use coupon code
export const useCoupon = asyncHandler(async (req, res) => {
  const { couponCode, orderAmount } = req.body;

  if (!couponCode || !orderAmount) {
    throw new ApiError(400, "Coupon code and order amount are required");
  }

  const offer = await Offer.findOne({
    couponCode: couponCode.toUpperCase(),
    isActive: true
  });

  if (!offer) {
    throw new ApiError(404, "Invalid coupon code");
  }

  const now = new Date();
  if (offer.validFrom > now) {
    throw new ApiError(400, "Coupon is not yet valid");
  }

  const validUntil = offer.validUntil || offer.validTill;
  if (validUntil && validUntil < now) {
    throw new ApiError(400, "Coupon has expired");
  }

  if (orderAmount < offer.minOrderAmount) {
    throw new ApiError(
      400,
      `Minimum order amount of ₹${offer.minOrderAmount} required`
    );
  }

  let discountAmount = 0;
  if (offer.discountType === "PERCENTAGE") {
    discountAmount = (orderAmount * offer.discountValue) / 100;
    if (offer.maxDiscount && discountAmount > offer.maxDiscount) {
      discountAmount = offer.maxDiscount;
    }
  } else {
    discountAmount = offer.discountValue;
  }

  // Update usage count
  offer.usedCount += 1;
  await offer.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        offer,
        discountAmount,
        finalAmount: orderAmount - discountAmount
      },
      "Coupon applied successfully"
    )
  );
});

// Get offers by category
export const getOffersByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  
  const now = new Date();
  const offers = await Offer.find({
    category,
    isActive: true,
    validFrom: { $lte: now },
    $or: [
      { validTill: { $gte: now } },
      { validUntil: { $gte: now } }
    ]
  }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, offers, `${category} offers fetched successfully`)
  );
});

