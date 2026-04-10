import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/authRoutes/auth.routes.js";
import outhRoutes from "./src/routes/authRoutes/outh.routes.js";
import resetPasswordRoutes from "./src/routes/authRoutes/resetPassword.routes.js";
import twoFactorRoutes from "./src/routes/authRoutes/2fa.routes.js";
import adminRoutes from "./src/routes/admin/admin.routes.js";
import userworkRoutes from "./src/routes/userworkRoutes/userwork.routes.js";
import bookingRoutes from "./src/routes/booking/booking.routes.js";
import paymentRoutes from "./src/routes/payment-gateway/payment-routes.js";
import { notFoundHandler, errorHandler } from "./src/middlewares/error/error.middleware.js";
import { client } from "./src/Config/redisConfig.js";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




// // Health Check Route
// app.get("/", async (req, res) => {
//   try {
//     let redisStatus = "✅";
//     try {
//       await client.ping();
//       console.log("app  is healthy");
//     } catch (err) {
//       redisStatus = "❌";
//     }

//     res.json({
//       status: "OK",
//       message: "API Running",
//       version: "1.0.0",
//       redis: redisStatus,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error) {
//     res.status(500).json({ status: "ERROR", message: error.message });
//   }
// });

// Health Check Route (Detailed)
app.get("/health", async (req, res) => {
  try {
    let redisStatus = "✅";
    try {
      await client.ping();
      console.log("Redis is healthy health check achha hai");
    } catch (err) {
      redisStatus = "❌";
    }

    res.json({
      status: "OK",
      uptime: `${Math.floor(process.uptime())}s`,
      memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      services: {
        api: "✅",
        database: "✅",
        redis: redisStatus,
        payment: "✅ Razorpay",
        queue: "✅ Bull",
      },
    });
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: error.message });
  }
});

// Routes with API versioning
app.use("/api/v1/auth", authRoutes);          
app.use("/api/v1/auth", outhRoutes);          
app.use("/api/v1/auth", resetPasswordRoutes);  
app.use("/api/v1/2fa", twoFactorRoutes);       
app.use("/api/v1/admin", adminRoutes);         
app.use("/api/v1/user", userworkRoutes);       
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Terminal middleware: unknown routes and centralized error responses
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
