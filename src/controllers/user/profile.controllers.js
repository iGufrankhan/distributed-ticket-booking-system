import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { User } from "../../models/user.models.js";

export const getUserprofile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password -__v');
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, "User profile fetched successfully", user));
});

export const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const updateData = req.body;
    
    // Prevent updating sensitive fields
    const restrictedFields = ['password', 'role', 'isEmailVerified', 'twoFactorSecret'];
    restrictedFields.forEach(field => delete updateData[field]);
    
    const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
    ).select('-password -__v');

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, "User profile updated successfully", user));
});

export const deleteUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    
    await User.findByIdAndDelete(userId);
    
    return res.status(200).json(new ApiResponse(200, "User profile deleted successfully"));
});











