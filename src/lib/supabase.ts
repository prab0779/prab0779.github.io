import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set up your Supabase project.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'implicit',
    detectSessionInUrl: true,
  },
});

const ITEM_IMAGES_BUCKET = 'Item Images';
const imageUrlCache = new Map<string, string>();

export function getItemImageUrl(emoji: string): string {
  if (!emoji) return '';
  if (emoji.startsWith('http')) return emoji;

  const cached = imageUrlCache.get(emoji);
  if (cached) return cached;

  const filename = emoji.replace(/^\.?\//, '');
  const { data } = supabase.storage.from(ITEM_IMAGES_BUCKET).getPublicUrl(filename);
  imageUrlCache.set(emoji, data.publicUrl);
  return data.publicUrl;
}