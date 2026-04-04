import {asyncHandler} from "../../../utils/AsyncHandler.js";
import { logout } from "../../services/auth/auth.service.js";
import { clearAuthCookies } from "../../lib/helper/cookiesadded.js";

export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken|| req.body?.refreshToken 
  const result = await logout({ refreshToken });
  clearAuthCookies(res);
  return res.status(200).json(result);
});
