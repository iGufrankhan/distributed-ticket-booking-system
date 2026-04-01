import { ApiError } from "../../../utils/ApiError.js";

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err?.statusCode || err?.statuscode || 500;
  const message = err?.message || "Internal Server Error";

  // Preserve existing ApiError details when available.
  const payload = {
    success: false,
    message,
    error: Array.isArray(err?.error) ? err.error : [message],
    data: null,
  };

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err?.stack;
  }

  res.status(statusCode).json(payload);
};
