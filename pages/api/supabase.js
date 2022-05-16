import { createClient } from "@supabase/supabase-js";

const options = {
  schema: "public",
  headers: { "x-my-custom-header": "meal-bot" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};
export default createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY,
  options
);
