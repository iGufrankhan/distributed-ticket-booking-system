import {asyncHandler} from "../../../utils/AsyncHandler.js";
import { logout } from "../../services/auth/auth.service.js";

export const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await logout({ refreshToken });
  return res.status(200).json(result);
});
