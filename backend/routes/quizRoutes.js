// Quiz API endpoints
import express from "express";
import { getQuizzes, createQuiz } from "../controllers/quizController.js";

const router = express.Router();

// Fetch all quizzes
router.get("/", getQuizzes);

// Create a new quiz
router.post("/", createQuiz);

export default router;
