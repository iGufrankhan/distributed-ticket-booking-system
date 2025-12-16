import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      select: false, 
    },

    authProvider: {
      type: String,
      enum: ["email", "google", "github"],
      default: "email",
    },
    isblocked: {
      type: Boolean,
      default: false,
    },

    googleId: {
      type: String,
      sparse: true,
    },

    githubId: {
      type: String,
      sparse: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isLocked: {
  type: Boolean,
  default: false,
},

failedLoginAttempts: {
  type: Number,
  default: 0,
},

twoFactorEnabled: {
  type: Boolean,
  default: false,
},

   

    isAdmin: {
      type: Boolean,
      default: false,
    },

  

    // Profile fields (optional)
    phone: {
      type: String,
      trim: true,
    },

   
  },
  { timestamps: true }
);

/**
 * Auto-generate a unique username from email or name
 */
userSchema.methods.generateUsername = async function () {
  const baseUsername = (this.email?.split("@")[0] || this.fullName)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  let username = baseUsername;
  let counter = 1;

  while (await mongoose.models.User.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  this.username = username;
  return username;
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
