import { supabase } from "../config/db.js";

// Get all campus locations
export const getCampusLocations = async (req, res) => {
  try {
    const { type, search } = req.query;

    let query = supabase
      .from("campus_locations")
      .select(`
        *,
        location_mentors (
          id,
          users (
            first_name,
            last_name,
            major
          )
        ),
        location_tips (
          id,
          content,
          helpful_count,
          created_at,
          users (
            first_name,
            last_name
          )
        )
      `)
      .order("name", { ascending: true });

    if (type) {
      query = query.eq("type", type);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data: locations, error } = await query;

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Process locations to include mentor and tip counts
    const processedLocations = locations.map(location => ({
      ...location,
      mentors: location.location_mentors ? location.location_mentors.length : 0,
      tips: location.location_tips ? location.location_tips.length : 0,
      mentorList: location.location_mentors ? location.location_mentors.map(m => ({
        id: m.id,
        name: m.users ? `${m.users.first_name} ${m.users.last_name}` : "Unknown",
        major: m.users?.major,
      })) : [],
      recentTips: location.location_tips ? 
        location.location_tips
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3)
          .map(tip => ({
            id: tip.id,
            content: tip.content,
            helpfulCount: tip.helpful_count,
            author: tip.users ? `${tip.users.first_name} ${tip.users.last_name}` : "Anonymous",
            createdAt: tip.created_at,
          })) : [],
    }));

    res.json({
      success: true,
      locations: processedLocations,
    });
  } catch (error) {
    console.error("Get locations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single campus location
export const getCampusLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: location, error } = await supabase
      .from("campus_locations")
      .select(`
        *,
        location_mentors (
          id,
          available_hours,
          specialties,
          users (
            first_name,
            last_name,
            major,
            year
          )
        ),
        location_tips (
          id,
          content,
          helpful_count,
          created_at,
          users (
            first_name,
            last_name
          ),
          tip_likes (
            user_id
          )
        )
      `)
      .eq("id", id)
      .single();

    if (error || !location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Process location data
    const processedLocation = {
      ...location,
      mentorList: location.location_mentors ? location.location_mentors.map(m => ({
        id: m.id,
        name: m.users ? `${m.users.first_name} ${m.users.last_name}` : "Unknown",
        major: m.users?.major,
        year: m.users?.year,
        availableHours: m.available_hours,
        specialties: m.specialties,
      })) : [],
      tipsList: location.location_tips ? location.location_tips.map(tip => ({
        id: tip.id,
        content: tip.content,
        helpfulCount: tip.helpful_count,
        author: tip.users ? `${tip.users.first_name} ${tip.users.last_name}` : "Anonymous",
        createdAt: tip.created_at,
        userLiked: req.user ? tip.tip_likes?.some(like => like.user_id === req.user.userId) : false,
      })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [],
    };

    res.json({
      success: true,
      location: processedLocation,
    });
  } catch (error) {
    console.error("Get location error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add tip to a location
export const addLocationTip = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, category } = req.body;

    // Check if location exists
    const { data: location, error: locationError } = await supabase
      .from("campus_locations")
      .select("id")
      .eq("id", id)
      .single();

    if (locationError || !location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const { data: tip, error } = await supabase
      .from("location_tips")
      .insert([
        {
          user_id: req.user.userId,
          location_id: id,
          content,
          category: category || "general",
          helpful_count: 0,
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

    // Add activity
    await supabase
      .from("user_activities")
      .insert([
        {
          user_id: req.user.userId,
          type: "tip_shared",
          description: `Shared a tip for ${location.name}`,
          xp_earned: 10, // Small XP reward for sharing tips
          created_at: new Date().toISOString(),
        },
      ]);

    // Update user XP
    const { data: user } = await supabase
      .from("users")
      .select("xp")
      .eq("id", req.user.userId)
      .single();

    if (user) {
      await supabase
        .from("users")
        .update({ xp: user.xp + 10 })
        .eq("id", req.user.userId);
    }

    res.status(201).json({
      success: true,
      tip: {
        ...tip,
        author: tip.users ? `${tip.users.first_name} ${tip.users.last_name}` : "Unknown",
        userLiked: false,
      },
      xpEarned: 10,
    });
  } catch (error) {
    console.error("Add tip error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark tip as helpful
export const markTipHelpful = async (req, res) => {
  try {
    const { tipId } = req.params;

    // Check if user already marked this tip as helpful
    const { data: existingLike } = await supabase
      .from("tip_likes")
      .select("*")
      .eq("user_id", req.user.userId)
      .eq("tip_id", tipId)
      .single();

    if (existingLike) {
      return res.status(400).json({ message: "Already marked as helpful" });
    }

    // Add like
    const { error: likeError } = await supabase
      .from("tip_likes")
      .insert([
        {
          user_id: req.user.userId,
          tip_id: tipId,
          created_at: new Date().toISOString(),
        },
      ]);

    if (likeError) {
      return res.status(400).json({ message: likeError.message });
    }

    // Update helpful count
    const { data: tip, error: updateError } = await supabase
      .from("location_tips")
      .select("helpful_count")
      .eq("id", tipId)
      .single();

    if (updateError) {
      return res.status(400).json({ message: updateError.message });
    }

    const { error: countError } = await supabase
      .from("location_tips")
      .update({ helpful_count: tip.helpful_count + 1 })
      .eq("id", tipId);

    if (countError) {
      return res.status(400).json({ message: countError.message });
    }

    res.json({
      success: true,
      message: "Tip marked as helpful",
      newCount: tip.helpful_count + 1,
    });
  } catch (error) {
    console.error("Mark helpful error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get nearby locations (based on coordinates)
export const getNearbyLocations = async (req, res) => {
  try {
    const { lat, lng, radius = 1000 } = req.query; // radius in meters

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    // Simple distance calculation (this could be improved with PostGIS in production)
    const { data: locations, error } = await supabase
      .from("campus_locations")
      .select("*");

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Calculate distances and filter
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const radiusKm = parseFloat(radius) / 1000;

    const nearbyLocations = locations
      .map(location => {
        const distance = calculateDistance(userLat, userLng, location.latitude, location.longitude);
        return { ...location, distance };
      })
      .filter(location => location.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      locations: nearbyLocations,
    });
  } catch (error) {
    console.error("Get nearby locations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
};

// Get location types
export const getLocationTypes = async (req, res) => {
  try {
    const { data: types, error } = await supabase
      .from("campus_locations")
      .select("type")
      .distinct();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const uniqueTypes = [...new Set(types.map(t => t.type))];

    res.json({
      success: true,
      types: uniqueTypes,
    });
  } catch (error) {
    console.error("Get location types error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Search locations
export const searchLocations = async (req, res) => {
  try {
    const { query, type } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    let searchQuery = supabase
      .from("campus_locations")
      .select("*")
      .or(`name.ilike.%${query}%, description.ilike.%${query}%, address.ilike.%${query}%`);

    if (type) {
      searchQuery = searchQuery.eq("type", type);
    }

    const { data: locations, error } = await searchQuery;

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({
      success: true,
      locations: locations || [],
      resultsCount: locations ? locations.length : 0,
    });
  } catch (error) {
    console.error("Search locations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
