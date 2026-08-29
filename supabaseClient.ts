import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Set this to whatever you named your bucket in Supabase.
export const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'book-pages';
