import { createClient } from '@supabase/supabase-js';

// This client uses the SERVICE ROLE key and must only ever be
// imported from server-side code (API routes), never from
// anything that ships to the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

export const BUCKET = 'book-pages';
