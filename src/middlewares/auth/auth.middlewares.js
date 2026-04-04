import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";
import { verifyAccessToken } from "../../../utils/token.js";
import { User } from "../../models/user.models.js";

const extractToken = (req) => {
  return (
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "")
  );
};

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    throw new ApiError(401, "You are not logged in. Please log in to get access.");
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decoded.userId).select("-password -__v");
  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = user;
  next();
});

export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    throw new ApiError(401, "Unauthorized request - No token provided");
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decoded.userId).select("-password -__v");
  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  if (!user.isAdmin) {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  req.user = user;
  next();
});