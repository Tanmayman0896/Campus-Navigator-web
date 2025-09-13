// Mentor API endpoints
import express from "express";
import { getMentors, createMentor } from "../controllers/mentorController.js";

const router = express.Router();

// Fetch all mentors
router.get("/", getMentors);

// Add a new mentor
router.post("/", createMentor);

export default router;

