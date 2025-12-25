import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/Config/dbConfig.js";
import {client} from './src/Config/redisConfig.js';

// Load env variables
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Test Redis connection
    client.ping()
      .then(() => console.log('🏓 Redis PING successful'))
      .catch(err => console.error('❌ Redis PING failed:', err));

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
