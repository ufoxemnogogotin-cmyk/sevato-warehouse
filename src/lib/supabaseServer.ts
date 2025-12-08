import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// по-късно може да минем на SERVICE_ROLE_KEY само от сървъра

// 🔹 ВАЖНО: името трябва да е "supabase"
export const supabase = createClient(supabaseUrl, supabaseKey);

// ако искаш да запазиш и старото име:
export const supabaseServer = supabase;

// по желание:
export default supabase;
