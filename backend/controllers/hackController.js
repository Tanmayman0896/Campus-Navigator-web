// Hack business logic
import supabase from "../config/supabaseClient.js";

// Get all SLMs
export const getSLMs = async (req, res) => {
  const { data, error } = await supabase
    .from("slms")
    .select("*")
    .order("order", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add a new SLM
export const createSLM = async (req, res) => {
  const { title, content, type, order, quizId } = req.body;

  const { data, error } = await supabase
    .from("slms")
    .insert([{ title, content, type, order, quizId }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
};
