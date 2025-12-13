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