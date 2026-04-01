import axios from "axios";
import { User } from "../../models/user.models.js";
import { generateUsernameFromEmail } from "../../lib/helper/generateUsernamefromemail.js";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  CLIENT_URL,
} from "../../../utils/constant.js";
import { generateAccessToken, generateRefreshToken } from "../../../utils/token.js";

export const googleOAuthService = async (
  code,
  redirectUri = `${CLIENT_URL}/auth/google/callback`
) => {
  const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
    params: {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    },
  });

  const providerAccessToken = tokenResponse.data.access_token;

  const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${providerAccessToken}`,
    },
  });

  const { email, name, id: googleId } = userInfoResponse.data;
  const baseUsername = generateUsernameFromEmail(email);

  let user = await User.findOne({ email }).select("+refreshToken");

  if (!user) {
    let username = baseUsername;
    let counter = 1;

    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter += 1;
    }

    user = new User({
      email,
      fullName: name,
      username,
      googleId,
      isEmailVerified: true,
      authProvider: "google",
    });
  } else if (!user.googleId) {
    user.googleId = googleId;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

export const githubOAuthService = async (code) => {
  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    },
    { headers: { Accept: "application/json" } }
  );

  const providerAccessToken = tokenRes.data.access_token;

  const userInfoRes = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${providerAccessToken}` },
  });

  const emailRes = await axios.get("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${providerAccessToken}` },
  });

  const { id: githubId, name } = userInfoRes.data;
  const primaryEmailObj = emailRes.data.find((item) => item.primary) || emailRes.data[0];
  const email = primaryEmailObj.email;

  const baseUsername = generateUsernameFromEmail(email);
  let user = await User.findOne({ email }).select("+refreshToken");

  if (!user) {
    let username = baseUsername;
    let counter = 1;

    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter += 1;
    }

    user = new User({
      email,
      fullName: name,
      username,
      githubId,
      isEmailVerified: true,
      authProvider: "github",
    });
  } else if (!user.githubId) {
    user.githubId = githubId;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};
