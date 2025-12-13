import { User } from "../../models/user.models.js";

export const generateUsernameFromEmail = async (email) => {
  const baseUsername = email

    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  
  let username = baseUsername;
  let counter = 1;

  while (await User.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
};

