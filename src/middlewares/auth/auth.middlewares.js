import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";
import { verifyAccessToken } from "../../../utils/token.js";
import { User } from "../../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    throw new ApiError(401, "Invalid access token");
  }

  const user = await User.findById(decoded.userId).select("-password -__v");

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = user;
  next();
});




// verify admin JWT middleware
export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request - No token provided");
  }

  // Use the same verifyAccessToken function
  const decoded = verifyAccessToken(token);
  


  if (!decoded) {
    throw new ApiError(401, "Invalid access token");
  }

  // decoded.userId matches your login token
  const user = await User.findById(decoded.userId).select("-password");
  

  if (!user) {
    throw new ApiError(401, "Invalid Access Token");
  }

  // Check if user is admin using isAdmin field
  if (!user.isAdmin) {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  req.user = user;
  next();
});