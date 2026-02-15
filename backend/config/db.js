import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test database connection
const connectDB = async () => {
  try {
    // Skip database connection check in development if using dummy values
    if (supabaseUrl.includes('dummy') || supabaseKey.includes('dummy')) {
      console.log("⚠️  Using dummy database values - Supabase connection skipped");
      console.log("✅ Server ready (database connection will be established when real credentials are provided)");
      return;
    }

    // Test the connection with a simple query
    const { data, error } = await supabase
      .from("users")
      .select("count", { count: "exact", head: true });
    
    if (error && error.code !== "PGRST116") { // PGRST116 means table doesn't exist yet
      console.error("Database connection failed:", error.message);
      console.log("⚠️  Continuing without database connection...");
      return;
    }
    
    console.log("✅ Connected to Supabase successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    console.log("⚠️  Continuing without database connection...");
  }
};

export default connectDB;
export { supabase };
