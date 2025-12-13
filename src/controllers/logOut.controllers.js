import { asyncHandler } from "../../utils/AsyncHandler.js";

export const logoutUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully. Please delete token on client.",
  });
});
