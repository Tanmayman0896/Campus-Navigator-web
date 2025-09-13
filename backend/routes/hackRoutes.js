// Hack API endpoints
import express from "express";
import { getHacks, createHack, upvoteHack } from "../controllers/hackController.js";

const router = express.Router();

// Fetch all hacks
router.get("/", getHacks);

// Add a new hack
router.post("/", createHack);

// Upvote a hack
router.post("/:id/upvote", upvoteHack);

export default router;

