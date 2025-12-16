import { User } from '../../models/user.models.js';
import {asyncHandler} from "../../../utils/AsyncHandler.js";
import {ApiError} from "../../../utils/ApiError.js";
import {ApiResponse} from "../../../utils/ApiResponse.js";

// get all users
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password -__v');
    return res.status(200).json(new ApiResponse(200, "Users fetched successfully", users));
});

// get user by id   
export const getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const userData = await User.findById(userId).select('-password -__v');

    if (!userData) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, "User fetched successfully", userData));
});

// delete user  
export const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const userData = await User.findById(userId);

    if (!userData) {        
        throw new ApiError(404, "User not found");
    }
    
    // Prevent deleting admin users
    if (userData.role === 'admin') {
        throw new ApiError(403, "Cannot delete admin users");
    }

    await User.findByIdAndDelete(userId);
    return res.status(200).json(new ApiResponse(200, "User deleted successfully"));
});

// block user
export const blockUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const userData = await User.findById(userId);
    
    if (!userData) {
        throw new ApiError(404, "User not found");
    }
    
    // Prevent blocking admin users
    if (userData.role === 'admin') {
        throw new ApiError(403, "Cannot block admin users");
    }
    
    userData.isBlocked = true;
    await userData.save();
    return res.status(200).json(new ApiResponse(200, "User blocked successfully", userData));
});

// unblock user
export const unblockUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const userData = await User.findById(userId);

    if (!userData) {        
        throw new ApiError(404, "User not found");
    }
    
    userData.isBlocked = false;
    await userData.save();
    return res.status(200).json(new ApiResponse(200, "User unblocked successfully", userData));
});

// Bulk block/unblock users
export const bulkToggleBlockUsers = asyncHandler(async (req, res) => {
    const { userIds, isBlocked } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
        throw new ApiError(400, "userIds must be a non-empty array");
    }

    if (typeof isBlocked !== 'boolean') {
        throw new ApiError(400, "isBlocked must be a boolean");
    }

    const result = await User.updateMany(
        { _id: { $in: userIds }, role: { $ne: 'admin' } }, // Don't block admins
        { $set: { isBlocked } }
    );

    res.status(200).json(new ApiResponse(
        200,
        `Users ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
        {
            matched: result.matchedCount,
            modified: result.modifiedCount,
        }
    ));
});


