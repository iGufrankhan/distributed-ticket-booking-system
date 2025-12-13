import express from "express";
import cors from "cors";
import dotenv from "dotenv";






import authRoutes from "./src/routes/authRoutes/auth.routes.js";
import  outhRoutes from "./src/routes/authRoutes/outh.routes.js";
import resetPasswordRoutes from "./src/routes/authRoutes/resetPassword.routes.js";
import twoFactorRoutes from "./src/routes/authRoutes/2fa.routes.js";







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

app.use("/api/auth", authRoutes);
app.use("/api/auth", outhRoutes);
app.use("/api/auth", resetPasswordRoutes);
app.use("/api/2fa", twoFactorRoutes);

export default app;
