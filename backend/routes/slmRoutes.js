// SLM API endpoints
import express from "express";
import { getSLMs, createSLM } from "../controllers/slmController.js";

const router = express.Router();

// Fetch all SLMs
router.get("/", getSLMs);

// Create a new SLM
router.post("/", createSLM);

export default router;

