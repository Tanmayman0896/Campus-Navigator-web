import express from "express";
import { body } from "express-validator";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProgress,
  getUserActivities,
  addUserActivity,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Validation rules
const registerValidation = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("studentId").trim().notEmpty().withMessage("Student ID is required"),
  body("major").trim().notEmpty().withMessage("Major is required"),
  body("year").isInt({ min: 1, max: 7 }).withMessage("Valid year is required"),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Public routes
router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);

// Protected routes
router.get("/profile", authenticate, getUserProfile);
router.put("/progress", authenticate, updateUserProgress);
router.get("/activities", authenticate, getUserActivities);
router.post("/activities", authenticate, addUserActivity);

export default router;
