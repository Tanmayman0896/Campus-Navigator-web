import { supabase } from "../config/db.js";

// Get all learning modules
export const getLearningModules = async (req, res) => {
  try {
    const { data: modules, error } = await supabase
      .from("learning_modules")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // If user is authenticated, get their progress
    let userProgress = {};
    if (req.user) {
      const { data: progress } = await supabase
        .from("user_module_progress")
        .select("*")
        .eq("user_id", req.user.userId);

      userProgress = progress?.reduce((acc, p) => {
        acc[p.module_id] = p;
        return acc;
      }, {}) || {};
    }

    // Combine modules with user progress
    const modulesWithProgress = modules.map(module => ({
      ...module,
      progress: userProgress[module.id]?.progress || 0,
      completed: userProgress[module.id]?.completed || false,
      locked: module.prerequisites ? !checkPrerequisites(module.prerequisites, userProgress) : false,
    }));

    res.json({
      success: true,
      modules: modulesWithProgress,
    });
  } catch (error) {
    console.error("Get modules error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single learning module
export const getLearningModule = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: module, error } = await supabase
      .from("learning_modules")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !module) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Get user progress if authenticated
    let userProgress = null;
    if (req.user) {
      const { data: progress } = await supabase
        .from("user_module_progress")
        .select("*")
        .eq("user_id", req.user.userId)
        .eq("module_id", id)
        .single();

      userProgress = progress;
    }

    res.json({
      success: true,
      module: {
        ...module,
        progress: userProgress?.progress || 0,
        completed: userProgress?.completed || false,
      },
    });
  } catch (error) {
    console.error("Get module error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Start a learning module
export const startModule = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if module exists
    const { data: module, error: moduleError } = await supabase
      .from("learning_modules")
      .select("*")
      .eq("id", id)
      .single();

    if (moduleError || !module) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Check prerequisites
    if (module.prerequisites) {
      const { data: userProgress } = await supabase
        .from("user_module_progress")
        .select("*")
        .eq("user_id", req.user.userId);

      const progressMap = userProgress?.reduce((acc, p) => {
        acc[p.module_id] = p;
        return acc;
      }, {}) || {};

      if (!checkPrerequisites(module.prerequisites, progressMap)) {
        return res.status(400).json({ message: "Prerequisites not met" });
      }
    }

    // Create or update progress entry
    const { data: existingProgress } = await supabase
      .from("user_module_progress")
      .select("*")
      .eq("user_id", req.user.userId)
      .eq("module_id", id)
      .single();

    if (existingProgress) {
      return res.json({
        success: true,
        message: "Module already started",
        progress: existingProgress,
      });
    }

    const { data: newProgress, error } = await supabase
      .from("user_module_progress")
      .insert([
        {
          user_id: req.user.userId,
          module_id: id,
          progress: 0,
          completed: false,
          started_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({
      success: true,
      message: "Module started successfully",
      progress: newProgress,
    });
  } catch (error) {
    console.error("Start module error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update module progress
export const updateModuleProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, completed } = req.body;

    // Validate progress
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: "Progress must be between 0 and 100" });
    }

    const { data: updatedProgress, error } = await supabase
      .from("user_module_progress")
      .update({
        progress,
        completed: completed || progress === 100,
        completed_at: completed || progress === 100 ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", req.user.userId)
      .eq("module_id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // If module completed, award XP and update user stats
    if (completed || progress === 100) {
      const { data: module } = await supabase
        .from("learning_modules")
        .select("xp_reward, badge_name")
        .eq("id", id)
        .single();

      if (module) {
        await awardModuleCompletion(req.user.userId, module);
      }
    }

    res.json({
      success: true,
      progress: updatedProgress,
    });
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Complete a learning module
export const completeModule = async (req, res) => {
  try {
    const { id } = req.params;

    // Get module info
    const { data: module, error: moduleError } = await supabase
      .from("learning_modules")
      .select("*")
      .eq("id", id)
      .single();

    if (moduleError || !module) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Update progress to completed
    const { data: updatedProgress, error } = await supabase
      .from("user_module_progress")
      .update({
        progress: 100,
        completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", req.user.userId)
      .eq("module_id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Award XP and badge
    await awardModuleCompletion(req.user.userId, module);

    // Add activity
    await supabase
      .from("user_activities")
      .insert([
        {
          user_id: req.user.userId,
          type: "module_completed",
          description: `Completed module: ${module.title}`,
          xp_earned: module.xp_reward,
          created_at: new Date().toISOString(),
        },
      ]);

    res.json({
      success: true,
      message: "Module completed successfully",
      progress: updatedProgress,
      xpEarned: module.xp_reward,
      badge: module.badge_name,
    });
  } catch (error) {
    console.error("Complete module error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to check prerequisites
const checkPrerequisites = (prerequisites, userProgress) => {
  if (!prerequisites || prerequisites.length === 0) return true;
  
  return prerequisites.every(prereqId => {
    const progress = userProgress[prereqId];
    return progress && progress.completed;
  });
};

// Helper function to award module completion
const awardModuleCompletion = async (userId, module) => {
  try {
    // Get current user stats
    const { data: user } = await supabase
      .from("users")
      .select("xp, badges, completed_modules, level")
      .eq("id", userId)
      .single();

    if (user) {
      const newXp = user.xp + module.xp_reward;
      const newLevel = Math.floor(newXp / 1000) + 1; // Level up every 1000 XP
      const newBadges = module.badge_name ? user.badges + 1 : user.badges;

      // Update user stats
      await supabase
        .from("users")
        .update({
          xp: newXp,
          level: newLevel,
          badges: newBadges,
          completed_modules: user.completed_modules + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      // Award badge if module has one
      if (module.badge_name) {
        await supabase
          .from("user_badges")
          .insert([
            {
              user_id: userId,
              badge_name: module.badge_name,
              earned_at: new Date().toISOString(),
            },
          ]);
      }
    }
  } catch (error) {
    console.error("Award completion error:", error);
  }
};

// Get user's module progress
export const getUserModuleProgress = async (req, res) => {
  try {
    const { data: progress, error } = await supabase
      .from("user_module_progress")
      .select(`
        *,
        learning_modules (
          id,
          title,
          xp_reward,
          badge_name
        )
      `)
      .eq("user_id", req.user.userId)
      .order("started_at", { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({
      success: true,
      progress: progress || [],
    });
  } catch (error) {
    console.error("Get user progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
