import { ApiError } from "../../../utils/ApiError.js";

export const isNotLocked = (req, res, next) => {
  if (req.user.isLocked) {
    throw new ApiError(403, "Account locked");
  }
    next();
};
