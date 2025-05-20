
// import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl =  process.env.NEXT_PUBLIC_SUPABASE_URL!; // Replace with your Supabase URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Replace with your Supabase Anon Key

export const supabase =  createBrowserClient(supabaseUrl, supabaseAnonKey);

// export function createClient() {
//   return createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )
// }