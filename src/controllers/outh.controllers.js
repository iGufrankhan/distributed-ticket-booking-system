
import {
  googleOAuthService,
    githubOAuthService,
} from '../services/outh.service.js';
import {asyncHandler} from '../../utils/AsyncHandler.js';
import {ApiResponse} from '../../utils/ApiResponse.js';


export const googleOAuthController = asyncHandler(async (req, res, next) => {
    const {code} = req.query;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    const result = await googleOAuthService(code, redirectUri);
    
    // Redirect to frontend with token or send JSON response
    res.status(200).json(new ApiResponse(200, result, "Google OAuth successful"));
});

export const githubOAuthController = asyncHandler(async (req, res, next) => {
    const {code} = req.query;
    const result = await githubOAuthService(code);
    
    // Redirect to frontend with token or send JSON response
    res.status(200).json(new ApiResponse(200, result, "GitHub OAuth successful"));
});
