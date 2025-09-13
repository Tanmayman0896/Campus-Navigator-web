import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import slmRoutes from "./routes/slmRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import hackRoutes from "./routes/hackRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

// DB connection
connectDB();

// Routes
app.use("/api/slms", slmRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/hacks", hackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));