// import { createBrowserClient } from '@supabase/ssr'


// export async function createClient(cookieStore: unknown){
//     return createBrowserClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     )
// }




// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =  process.env.NEXT_PUBLIC_SUPABASE_URL!; // Replace with your Supabase URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Replace with your Supabase Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);