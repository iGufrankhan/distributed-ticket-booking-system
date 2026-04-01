import bcrypt from "bcryptjs";
import { User } from "../../models/user.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import {ApiResponse} from "../../../utils/ApiResponse.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../../utils/token.js";

export const register = async ({ name, email, password, role = "user" }) => {
  const existed = await User.findOne({ email });
  if (existed) throw new ApiError(400, "Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullName: name,
    email,
    password: hashedPassword,
    authProvider: "email",
  });

  // Generate username
  await newUser.generateUsername();
  await newUser.save();

  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);
  newUser.refreshToken = refreshToken;
  await newUser.save({ validateBeforeSave: false });


  return new ApiResponse(
    201,
    {
      id: newUser._id,
      name: newUser.fullName,
      email: newUser.email,
      username: newUser.username,
      accessToken,
      refreshToken
    },
    "User registered successfully"
  );
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(400, "Invalid email or password");

  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before login");
  }

  if (user.isLocked) {
    throw new ApiError(403, "Account is locked. Please contact support.");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= 5) {
      user.isLocked = true;
    }

    await user.save();
    throw new ApiError(401, "Invalid credentials");
  }

  // Reset failed attempts on successful login
  user.failedLoginAttempts = 0;
  await user.save();

  // Check if 2FA is enabled
  if (user.twoFactorEnabled) {
    // Send 2FA OTP
    const { send2FAOtp } = await import("./2fa.service.js");
    await send2FAOtp(user);
    
    return new ApiResponse(
      200,
      {
        requires2FA: true,
        email: user.email,
      },
      "2FA code sent to your email. Please verify to complete login."
    );
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return new ApiResponse(
    200,
    {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    },
    "Login successful"
  );
};

export const refreshAccessToken = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.userId).select("+refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.refreshToken || user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Refresh token is invalid or has been revoked");
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return new ApiResponse(
    200,
    {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
    "Access token refreshed successfully"
  );
};

export const logout = async ({ refreshToken }) => {
  if (refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);
    if (decoded?.userId) {
      await User.findByIdAndUpdate(decoded.userId, { $unset: { refreshToken: 1 } });
    }
  }

  return new ApiResponse(
    200,
    null,
    "Logged out successfully"
  );
};


