import { ApiError } from "../../../utils/ApiError.js";

export const isVerified = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    throw new ApiError(403, "Email not verified");
  }
  next();
};
