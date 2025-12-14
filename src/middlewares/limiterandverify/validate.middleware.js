import { ApiError } from "../../../utils/ApiError.js";

/**
 * Middleware to validate request body against Joi schema
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Show all validation errors
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      throw new ApiError(400, errorMessage);
    }

    // Replace request body with validated value
    req.body = value;
    next();
  };
};
