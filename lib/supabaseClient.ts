import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Set this to whatever you named your bucket in Supabase.
export const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'book-pages';

// Narration clips live under an "audio/" prefix in the same bucket,
// named to match their page image (page_012.jpg -> audio/page_012.mp3).
export function narrationUrlFor(imagePath: string): string {
  const base = imagePath.replace(/\.[^/.]+$/, '');
  return supabase.storage.from(BUCKET).getPublicUrl(`audio/${base}.mp3`).data.publicUrl;
}

// Landing page background music.
export function landingMusicUrl(): string {
  return supabase.storage.from(BUCKET).getPublicUrl('audio/landing.mp3').data.publicUrl;
}

// Optional author photo.
export function authorPhotoUrl(): string {
  return supabase.storage.from(BUCKET).getPublicUrl('site/author.jpg').data.publicUrl;
}
