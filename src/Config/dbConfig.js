import mongoose from "mongoose";
import { MONGO_URI } from "../../utils/constant.js";

export const connectDB = async () => {
  const mongoUri = MONGO_URI;
  
  if (!mongoUri) {
    console.error("❌ MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ MongoDB Connection Failed:", errorMessage);
    process.exit(1); // stop server if db fails
  }
};
