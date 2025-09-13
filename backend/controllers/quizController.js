import supabase from "../config/supabaseClient.js";

// Fetch all quizzes
export const getQuizzes = async (req, res) => {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Create a new quiz
export const createQuiz = async (req, res) => {
  const { question, options, answer } = req.body;

  const { data, error } = await supabase
    .from("quizzes")
    .insert([{ question, options, answer }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
};
