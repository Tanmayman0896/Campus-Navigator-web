import express from "express";
import { body } from "express-validator";
import {
  getCommunityPosts,
  createCommunityPost,
  togglePostLike,
  addComment,
  getMentorSessions,
  joinMentorSession,
  leaveMentorSession,
  getCommunityStats,
} from "../controllers/communityController.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Validation rules
const postValidation = [
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("title").optional().trim(),
];

const commentValidation = [
  body("content").trim().notEmpty().withMessage("Comment content is required"),
];

// Posts routes
router.get("/posts", optionalAuth, getCommunityPosts);
router.post("/posts", authenticate, postValidation, createCommunityPost);
router.post("/posts/:id/like", authenticate, togglePostLike);
router.post("/posts/:id/comments", authenticate, commentValidation, addComment);

// Sessions routes
router.get("/sessions", optionalAuth, getMentorSessions);
router.post("/sessions/:id/join", authenticate, joinMentorSession);
router.delete("/sessions/:id/leave", authenticate, leaveMentorSession);

// Stats route
router.get("/stats", optionalAuth, getCommunityStats);

export default router;
