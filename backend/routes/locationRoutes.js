import express from "express";
import { body } from "express-validator";
import {
  getCampusLocations,
  getCampusLocation,
  addLocationTip,
  markTipHelpful,
  getNearbyLocations,
  getLocationTypes,
  searchLocations,
} from "../controllers/locationController.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Validation rules
const tipValidation = [
  body("content").trim().notEmpty().withMessage("Tip content is required"),
  body("category").optional().trim(),
];

// Location routes
router.get("/", optionalAuth, getCampusLocations);
router.get("/types", getLocationTypes);
router.get("/search", optionalAuth, searchLocations);
router.get("/nearby", optionalAuth, getNearbyLocations);
router.get("/:id", optionalAuth, getCampusLocation);

// Tip routes
router.post("/:id/tips", authenticate, tipValidation, addLocationTip);
router.post("/tips/:tipId/helpful", authenticate, markTipHelpful);

export default router;
