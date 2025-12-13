import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { JWT_SECRET } from "../../utils/constant.js";

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

  return new ApiResponse(
    201,
    {
      id: newUser._id,
      name: newUser.fullName,
      email: newUser.email,
      username: newUser.username,
    },
    "User registered successfully"
  );
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(400, "Invalid email or password");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new ApiError(400, "Invalid email or password");

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return new ApiResponse(
    200,
    {
      token,
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