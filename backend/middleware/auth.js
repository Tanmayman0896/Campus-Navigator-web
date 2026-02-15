import jwt from "jsonwebtoken";
import { supabase } from "../config/db.js";

// Verify JWT token middleware
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "campus-navigator-secret");
    
    // Check if user exists
    const { data: user, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Optional authentication (for public endpoints that benefit from user context)
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "campus-navigator-secret");
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("id", decoded.userId)
        .single();

      if (user) {
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
