import axios from 'axios';
import JWT from 'jsonwebtoken';
import { ApiError } from '../../utils/ApiError.js';
import { User } from '../models/user.models.js';
import { generateUsernameFromEmail } from '../lib/helper/generateUsernamefromemail.js';
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET, CLIENT_URL} from '../../utils/constant.js';
import { generateAccessToken } from '../../utils/token.js';

export const googleOAuthService = async (code, redirectUri = `${CLIENT_URL}/auth/google/callback`) => {    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
        params: {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        },
    });
    const accessToken = tokenResponse.data.access_token;

    // Fetch user info
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {  
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const { email, name, id: googleId } = userInfoResponse.data;

    const baseUsername=generateUsernameFromEmail(email);

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
     
        let username = baseUsername;
        let counter = 1;
        while (await User.findOne({ username })) {
            username = `${baseUsername}${counter}`;
            counter++;
        }
        user = new User({ email, fullName: name, username, googleId, isEmailVerified: true, authProvider: 'google' });        
        await user.save();
    } else if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
    }
    // Generate JWT
    const token = generateAccessToken({ userId: user._id });
    return { user, token };
};




export const githubOAuthService = async (code) => {    
    // Exchange code for access token
     const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    },
    { headers: { Accept: "application/json" } }
  );

    const accessToken = tokenRes.data.access_token;

    // Fetch user info
    const userInfoRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }); 
    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const { id: githubId, name } = userInfoRes.data;
    const primaryEmailObj = emailRes.data.find((email) => email.primary) || emailRes.data[0];
    const email = primaryEmailObj.email;
    // Find or create user

    const baseUsername=generateUsernameFromEmail(email);
    let user = await User.findOne({ email });
    if (!user) {
        const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        let username = baseUsername;
        let counter = 1;
        while (await User.findOne({ username })) {
            username = `${baseUsername}${counter}`;
            counter++;
        }
        user = new User({ email, fullName: name, username, githubId, isEmailVerified: true, authProvider: 'github' });        
        await user.save();
    } else if (!user.githubId) {
        user.githubId = githubId;
        await user.save();
    }
    // Generate JWT
    const token = generateAccessToken({ userId: user._id });
    return { user, token };
};








