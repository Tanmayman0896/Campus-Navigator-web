import { supabase } from "../config/db.js";

// Get user dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user basic info
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get module progress
    const { data: moduleProgress } = await supabase
      .from("user_module_progress")
      .select(`
        *,
        learning_modules (
          title,
          xp_reward
        )
      `)
      .eq("user_id", userId);

    // Get recent activities
    const { data: activities } = await supabase
      .from("user_activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    // Get user badges
    const { data: badges } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });

    // Calculate additional stats
    const completedModules = moduleProgress?.filter(p => p.completed).length || 0;
    const totalModules = await getTotalModulesCount();
    const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

    // Calculate level progress
    const currentLevelXp = (user.level - 1) * 1000;
    const nextLevelXp = user.level * 1000;
    const levelProgress = ((user.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

    res.json({
      success: true,
      stats: {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          major: user.major,
          year: user.year,
          level: user.level,
          xp: user.xp,
          totalBadges: user.badges,
          completedModules: user.completed_modules,
        },
        progress: {
          completedModules,
          totalModules,
          progressPercentage,
          levelProgress: Math.max(0, Math.min(100, levelProgress)),
          nextLevelXp: nextLevelXp - user.xp,
        },
        recentActivities: activities?.map(activity => ({
          id: activity.id,
          type: activity.type,
          description: activity.description,
          xpEarned: activity.xp_earned,
          createdAt: activity.created_at,
        })) || [],
        badges: badges?.map(badge => ({
          id: badge.id,
          name: badge.badge_name,
          earnedAt: badge.earned_at,
        })) || [],
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user leaderboard position
export const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10, type = "xp" } = req.query;

    let orderBy = "xp";
    if (type === "modules") orderBy = "completed_modules";
    if (type === "level") orderBy = "level";

    const { data: leaderboard, error } = await supabase
      .from("users")
      .select(`
        id,
        first_name,
        last_name,
        major,
        year,
        level,
        xp,
        completed_modules,
        badges
      `)
      .order(orderBy, { ascending: false })
      .limit(parseInt(limit));

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      major: user.major,
      year: user.year,
      level: user.level,
      xp: user.xp,
      completedModules: user.completed_modules,
      badges: user.badges,
    }));

    // Get current user's position if authenticated
    let userPosition = null;
    if (req.user) {
      const { data: allUsers } = await supabase
        .from("users")
        .select("id, " + orderBy)
        .order(orderBy, { ascending: false });

      const userIndex = allUsers?.findIndex(u => u.id === req.user.userId);
      if (userIndex !== -1) {
        userPosition = {
          rank: userIndex + 1,
          total: allUsers.length,
        };
      }
    }

    res.json({
      success: true,
      leaderboard: rankedLeaderboard,
      userPosition,
      type,
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user achievements
export const getAchievements = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user badges
    const { data: badges, error: badgesError } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });

    if (badgesError) {
      return res.status(400).json({ message: badgesError.message });
    }

    // Get user stats for achievement calculation
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      return res.status(400).json({ message: userError.message });
    }

    // Calculate achievement progress
    const achievements = [
      {
        id: "first_module",
        name: "First Steps",
        description: "Complete your first learning module",
        icon: "🎯",
        unlocked: user.completed_modules >= 1,
        progress: Math.min(user.completed_modules, 1),
        target: 1,
      },
      {
        id: "module_master",
        name: "Module Master",
        description: "Complete 5 learning modules",
        icon: "📚",
        unlocked: user.completed_modules >= 5,
        progress: Math.min(user.completed_modules, 5),
        target: 5,
      },
      {
        id: "learning_legend",
        name: "Learning Legend",
        description: "Complete 10 learning modules",
        icon: "🏆",
        unlocked: user.completed_modules >= 10,
        progress: Math.min(user.completed_modules, 10),
        target: 10,
      },
      {
        id: "xp_hunter",
        name: "XP Hunter",
        description: "Earn 1000 XP",
        icon: "⚡",
        unlocked: user.xp >= 1000,
        progress: Math.min(user.xp, 1000),
        target: 1000,
      },
      {
        id: "level_up",
        name: "Level Up",
        description: "Reach level 5",
        icon: "🆙",
        unlocked: user.level >= 5,
        progress: Math.min(user.level, 5),
        target: 5,
      },
      {
        id: "badge_collector",
        name: "Badge Collector",
        description: "Earn 3 badges",
        icon: "🎖️",
        unlocked: user.badges >= 3,
        progress: Math.min(user.badges, 3),
        target: 3,
      },
    ];

    res.json({
      success: true,
      badges: badges?.map(badge => ({
        id: badge.id,
        name: badge.badge_name,
        earnedAt: badge.earned_at,
      })) || [],
      achievements,
    });
  } catch (error) {
    console.error("Get achievements error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get activity feed
export const getActivityFeed = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { data: activities, error } = await supabase
      .from("user_activities")
      .select(`
        *,
        users (
          first_name,
          last_name,
          major
        )
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const processedActivities = activities?.map(activity => ({
      id: activity.id,
      type: activity.type,
      description: activity.description,
      xpEarned: activity.xp_earned,
      createdAt: activity.created_at,
      user: activity.users ? {
        name: `${activity.users.first_name} ${activity.users.last_name}`,
        major: activity.users.major,
      } : null,
    })) || [];

    res.json({
      success: true,
      activities: processedActivities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: activities?.length === parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get activity feed error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user streak
export const updateUserStreak = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's current streak data
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("current_streak, last_activity_date")
      .eq("id", userId)
      .single();

    if (userError) {
      return res.status(400).json({ message: userError.message });
    }

    const today = new Date().toDateString();
    const lastActivity = user.last_activity_date ? new Date(user.last_activity_date).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = user.current_streak || 0;

    if (lastActivity === today) {
      // Already recorded activity today, no change
      return res.json({
        success: true,
        streak: newStreak,
        message: "Activity already recorded today",
      });
    } else if (lastActivity === yesterday) {
      // Consecutive day, increment streak
      newStreak += 1;
    } else if (lastActivity !== today) {
      // Streak broken, start new
      newStreak = 1;
    }

    // Update user streak
    const { error: updateError } = await supabase
      .from("users")
      .update({
        current_streak: newStreak,
        last_activity_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      return res.status(400).json({ message: updateError.message });
    }

    res.json({
      success: true,
      streak: newStreak,
      message: "Streak updated successfully",
    });
  } catch (error) {
    console.error("Update streak error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to get total modules count
const getTotalModulesCount = async () => {
  try {
    const { count } = await supabase
      .from("learning_modules")
      .select("*", { count: "exact", head: true });
    return count || 0;
  } catch (error) {
    console.error("Get total modules count error:", error);
    return 0;
  }
};
