import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://onjywjzwrhbhcmdazsfi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uanl3anp3cmhiaGNtZGF6c2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzcyMjEsImV4cCI6MjA3NTc1MzIyMX0.r4zq0kva7S6F_Lb56BkfeVj2uo1NAtd56hEweJR_5E8"
);

// process.env.NEXT_PUBLIC_SUPABASE_URL!,
// process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
