import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, JWT_SECRET,} from "./constant.js";

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn:ACCESS_TOKEN_EXPIRY   });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};



export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};



export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};


