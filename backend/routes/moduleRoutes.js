import express from "express";
import { body } from "express-validator";
import {
  getLearningModules,
  getLearningModule,
  startModule,
  updateModuleProgress,
  completeModule,
  getUserModuleProgress,
} from "../controllers/moduleController.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Validation rules
const progressValidation = [
  body("progress")
    .isInt({ min: 0, max: 100 })
    .withMessage("Progress must be between 0 and 100"),
];

// Public routes (with optional auth for user context)
router.get("/", optionalAuth, getLearningModules);
router.get("/:id", optionalAuth, getLearningModule);

// Protected routes
router.post("/:id/start", authenticate, startModule);
router.put("/:id/progress", authenticate, progressValidation, updateModuleProgress);
router.post("/:id/complete", authenticate, completeModule);
router.get("/user/progress", authenticate, getUserModuleProgress);

export default router;
