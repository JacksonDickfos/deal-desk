import { createClient } from '@supabase/supabase-js';
import { Deal } from '@/types';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Deal operations
export const getDeals = async (): Promise<Deal[]> => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('updatedAt', { ascending: false });

  if (error) {
    console.error('Error fetching deals:', error);
    return [];
  }

  return data.map(deal => ({
    ...deal,
    demo_date: deal.demo_date ? new Date(deal.demo_date) : undefined,
    updatedAt: new Date(deal.updatedAt)
  }));
};

export const updateDeal = async (deal: Deal): Promise<void> => {
  const { error } = await supabase
    .from('deals')
    .upsert({
      ...deal,
      demo_date: deal.demo_date?.toISOString(),
      updatedAt: new Date().toISOString()
    });

  if (error) {
    console.error('Error updating deal:', error);
    throw error;
  }
};

export const addDeal = async (deal: Deal): Promise<void> => {
  const { error } = await supabase
    .from('deals')
    .insert({
      ...deal,
      demo_date: deal.demo_date?.toISOString(),
      updatedAt: new Date().toISOString()
    });

  if (error) {
    console.error('Error adding deal:', error);
    throw error;
  }
}; 