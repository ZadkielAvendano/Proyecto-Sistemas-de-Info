import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://eovmmgneddkqooabwvhc.supabase.co"; // Replace with your actual Supabase URL
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdm1tZ25lZGRrcW9vYWJ3dmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NTU1ODgsImV4cCI6MjA2NTUzMTU4OH0.vFfk0LDWQhtH-d3gPMFLAhYEmAqGQgk5RkgaT6V1RL4"; // Replace with your actual anon key

export const supaBase = createClient(supabaseUrl, supabaseAnonKey);