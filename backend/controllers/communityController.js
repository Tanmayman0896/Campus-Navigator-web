import { supabase } from "../config/db.js";

// Get all community posts
export const getCommunityPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("community_posts")
      .select(`
        *,
        users (
          id,
          first_name,
          last_name,
          major,
          year
        ),
        post_likes (
          user_id
        ),
        post_comments (
          id,
          content,
          created_at,
          users (
            first_name,
            last_name
          )
        )
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq("category", category);
    }

    const { data: posts, error } = await query;

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Process posts to include like count and user like status
    const processedPosts = posts.map(post => ({
      ...post,
      author: post.users ? {
        id: post.users.id,
        name: `${post.users.first_name} ${post.users.last_name}`,
        major: post.users.major,
        year: post.users.year,
      } : null,
      likes: post.post_likes ? post.post_likes.length : 0,
      userLiked: req.user ? post.post_likes?.some(like => like.user_id === req.user.userId) : false,
      comments: post.post_comments ? post.post_comments.length : 0,
      recentComments: post.post_comments ? post.post_comments.slice(0, 3) : [],
    }));

    res.json({
      success: true,
      posts: processedPosts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: posts.length === parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new community post
export const createCommunityPost = async (req, res) => {
  try {
    const { content, category, title } = req.body;

    const { data: post, error } = await supabase
      .from("community_posts")
      .insert([
        {
          user_id: req.user.userId,
          title,
          content,
          category,
          created_at: new Date().toISOString(),
        },
      ])
      .select(`
        *,
        users (
          first_name,
          last_name,
          major,
          year
        )
      `)
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Add activity
    await supabase
      .from("user_activities")
      .insert([
        {
          user_id: req.user.userId,
          type: "post_created",
          description: "Created a new community post",
          created_at: new Date().toISOString(),
        },
      ]);

    res.status(201).json({
      success: true,
      post: {
        ...post,
        author: post.users ? {
          name: `${post.users.first_name} ${post.users.last_name}`,
          major: post.users.major,
          year: post.users.year,
        } : null,
        likes: 0,
        userLiked: false,
        comments: 0,
        recentComments: [],
      },
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Like/unlike a post
export const togglePostLike = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user already liked the post
    const { data: existingLike } = await supabase
      .from("post_likes")
      .select("*")
      .eq("user_id", req.user.userId)
      .eq("post_id", id)
      .single();

    if (existingLike) {
      // Unlike the post
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("user_id", req.user.userId)
        .eq("post_id", id);

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.json({
        success: true,
        liked: false,
        message: "Post unliked",
      });
    } else {
      // Like the post
      const { error } = await supabase
        .from("post_likes")
        .insert([
          {
            user_id: req.user.userId,
            post_id: id,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.json({
        success: true,
        liked: true,
        message: "Post liked",
      });
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add comment to a post
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const { data: comment, error } = await supabase
      .from("post_comments")
      .insert([
        {
          user_id: req.user.userId,
          post_id: id,
          content,
          created_at: new Date().toISOString(),
        },
      ])
      .select(`
        *,
        users (
          first_name,
          last_name
        )
      `)
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({
      success: true,
      comment: {
        ...comment,
        author: comment.users ? `${comment.users.first_name} ${comment.users.last_name}` : "Unknown User",
      },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get mentor sessions
export const getMentorSessions = async (req, res) => {
  try {
    const { data: sessions, error } = await supabase
      .from("mentor_sessions")
      .select(`
        *,
        mentors:users!mentor_id (
          first_name,
          last_name,
          major
        ),
        session_participants (
          user_id
        )
      `)
      .gte("session_date", new Date().toISOString())
      .order("session_date", { ascending: true });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const processedSessions = sessions.map(session => ({
      ...session,
      mentor_name: session.mentors ? `${session.mentors.first_name} ${session.mentors.last_name}` : "Unknown Mentor",
      mentor_major: session.mentors?.major,
      participants_count: session.session_participants ? session.session_participants.length : 0,
      user_joined: req.user ? session.session_participants?.some(p => p.user_id === req.user.userId) : false,
      spots_remaining: session.max_participants - (session.session_participants ? session.session_participants.length : 0),
    }));

    res.json({
      success: true,
      sessions: processedSessions,
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Join a mentor session
export const joinMentorSession = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if session exists and has capacity
    const { data: session, error: sessionError } = await supabase
      .from("mentor_sessions")
      .select(`
        *,
        session_participants (
          user_id
        )
      `)
      .eq("id", id)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if session is full
    const currentParticipants = session.session_participants ? session.session_participants.length : 0;
    if (currentParticipants >= session.max_participants) {
      return res.status(400).json({ message: "Session is full" });
    }

    // Check if user already joined
    if (session.session_participants?.some(p => p.user_id === req.user.userId)) {
      return res.status(400).json({ message: "Already joined this session" });
    }

    // Add user to session
    const { error } = await supabase
      .from("session_participants")
      .insert([
        {
          user_id: req.user.userId,
          session_id: id,
          joined_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Add activity
    await supabase
      .from("user_activities")
      .insert([
        {
          user_id: req.user.userId,
          type: "session_joined",
          description: `Joined mentor session: ${session.title}`,
          created_at: new Date().toISOString(),
        },
      ]);

    res.json({
      success: true,
      message: "Successfully joined the session",
    });
  } catch (error) {
    console.error("Join session error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Leave a mentor session
export const leaveMentorSession = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("session_participants")
      .delete()
      .eq("user_id", req.user.userId)
      .eq("session_id", id);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({
      success: true,
      message: "Successfully left the session",
    });
  } catch (error) {
    console.error("Leave session error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get community stats
export const getCommunityStats = async (req, res) => {
  try {
    // Get total posts count
    const { count: postsCount } = await supabase
      .from("community_posts")
      .select("*", { count: "exact", head: true });

    // Get total users count
    const { count: usersCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    // Get active sessions count
    const { count: sessionsCount } = await supabase
      .from("mentor_sessions")
      .select("*", { count: "exact", head: true })
      .gte("session_date", new Date().toISOString());

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from("user_activities")
      .select(`
        *,
        users (
          first_name,
          last_name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalPosts: postsCount || 0,
        totalUsers: usersCount || 0,
        activeSessions: sessionsCount || 0,
        recentActivity: recentActivity || [],
      },
    });
  } catch (error) {
    console.error("Get community stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
