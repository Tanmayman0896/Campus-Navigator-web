import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Campus Navigator API is running!",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      modules: "/api/modules",
      community: "/api/community",
      locations: "/api/locations",
      progress: "/api/progress",
    },
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/progress", progressRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(`API documentation: http://localhost:${PORT}`);
  console.log(`CORS enabled for: http://localhost:3000, http://localhost:3001`);
});

export default app;