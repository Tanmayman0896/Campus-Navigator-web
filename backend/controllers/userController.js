import { supabase } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "campus-navigator-secret", {
    expiresIn: "30d",
  });
};

// Register user
export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, studentId, major, year } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password: hashedPassword,
          student_id: studentId,
          major,
          year,
          level: 1,
          xp: 0,
          badges: 0,
          completed_modules: 0,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Generate token
    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email,
        studentId: newUser.student_id,
        major: newUser.major,
        year: newUser.year,
        level: newUser.level,
        xp: newUser.xp,
        badges: newUser.badges,
        completedModules: newUser.completed_modules,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        studentId: user.student_id,
        major: user.major,
        year: user.year,
        level: user.level,
        xp: user.xp,
        badges: user.badges,
        completedModules: user.completed_modules,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        studentId: user.student_id,
        major: user.major,
        year: user.year,
        level: user.level,
        xp: user.xp,
        badges: user.badges,
        completedModules: user.completed_modules,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user progress
export const updateUserProgress = async (req, res) => {
  try {
    const { xp, level, badges, completedModules } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .update({
        xp,
        level,
        badges,
        completed_modules: completedModules,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.user.userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        level: user.level,
        xp: user.xp,
        badges: user.badges,
        completedModules: user.completed_modules,
      },
    });
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user activities
export const getUserActivities = async (req, res) => {
  try {
    const { data: activities, error } = await supabase
      .from("user_activities")
      .select("*")
      .eq("user_id", req.user.userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({
      success: true,
      activities: activities || [],
    });
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add user activity
export const addUserActivity = async (req, res) => {
  try {
    const { type, description, xp_earned } = req.body;

    const { data: activity, error } = await supabase
      .from("user_activities")
      .insert([
        {
          user_id: req.user.userId,
          type,
          description,
          xp_earned: xp_earned || 0,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error("Add activity error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
