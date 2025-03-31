import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

// Storage bucket names
export const STORAGE_BUCKETS = {
  PRODUCTS: 'product-images',
  OWNERS: 'owner-images'
} as const;

// Helper function to get public URL for an image
export const getImageUrl = (bucket: typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS], path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}; 