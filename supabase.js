import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://iizqqbdczorzypgneais.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpenFxYmRjem9yenlwZ25lYWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYzNzM0MDMsImV4cCI6MjA0MTk0OTQwM30.9oRoFnOjJapMUTPI19Q6UP1_XQvRm-TyL7u57Q_2x6s";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
