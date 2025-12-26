import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/authRoutes/auth.routes.js";
import outhRoutes from "./src/routes/authRoutes/outh.routes.js";
import resetPasswordRoutes from "./src/routes/authRoutes/resetPassword.routes.js";
import twoFactorRoutes from "./src/routes/authRoutes/2fa.routes.js";
import adminRoutes from "./src/routes/admin/admin.routes.js";
import userworkRoutes from "./src/routes/userworkRoutes/userwork.routes.js";
import bookingRoutes from "./src/routes/booking/booking.routes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Distributed Ticket Booking System API is running 🚀"
  });
});

// Routes with API versioning
app.use("/api/v1/auth", authRoutes);          
app.use("/api/v1/auth", outhRoutes);          
app.use("/api/v1/auth", resetPasswordRoutes);  
app.use("/api/v1/2fa", twoFactorRoutes);       
app.use("/api/v1/admin", adminRoutes);         
app.use("/api/v1/user", userworkRoutes);    

app.use("/api/v1/booking", bookingRoutes);         




export default app;
