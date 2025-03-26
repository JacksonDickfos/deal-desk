import { createClient } from '@supabase/supabase-js';
import { Deal } from '@/types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
    demoDate: deal.demoDate ? new Date(deal.demoDate) : undefined,
    updatedAt: new Date(deal.updatedAt)
  }));
};

export const updateDeal = async (deal: Deal): Promise<void> => {
  const { error } = await supabase
    .from('deals')
    .upsert({
      ...deal,
      demoDate: deal.demoDate?.toISOString(),
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
      demoDate: deal.demoDate?.toISOString(),
      updatedAt: new Date().toISOString()
    });

  if (error) {
    console.error('Error adding deal:', error);
    throw error;
  }
}; 