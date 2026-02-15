import express from "express";
import {
  getDashboardStats,
  getLeaderboard,
  getAchievements,
  getActivityFeed,
  updateUserStreak,
} from "../controllers/progressController.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Progress routes
router.get("/dashboard", authenticate, getDashboardStats);
router.get("/leaderboard", optionalAuth, getLeaderboard);
router.get("/achievements", authenticate, getAchievements);
router.get("/activity-feed", optionalAuth, getActivityFeed);
router.post("/streak", authenticate, updateUserStreak);

export default router;
