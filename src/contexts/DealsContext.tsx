'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Deal } from '@/types';
import { supabase, getDeals as fetchDeals, updateDeal as updateDealInDb, addDeal as addDealToDb } from '@/utils/supabase';

interface DealsContextType {
  deals: Deal[];
  addDeal: (deal: Deal) => Promise<void>;
  updateDeal: (deal: Deal) => Promise<void>;
  deleteDeal: (dealId: string) => Promise<void>;
  isLoading: boolean;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export function DealsProvider({ children }: { children: ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial fetch of deals
    const loadDeals = async () => {
      try {
        const deals = await fetchDeals();
        setDeals(deals);
      } catch (error) {
        console.error('Error loading deals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDeals();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('deals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deals' }, async () => {
        const updatedDeals = await fetchDeals();
        setDeals(updatedDeals);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addDeal = async (newDeal: Deal) => {
    try {
      await addDealToDb(newDeal);
      const updatedDeals = await fetchDeals();
      setDeals(updatedDeals);
    } catch (error) {
      console.error('Error adding deal:', error);
      throw error;
    }
  };

  const updateDeal = async (updatedDeal: Deal) => {
    try {
      await updateDealInDb(updatedDeal);
      const updatedDeals = await fetchDeals();
      setDeals(updatedDeals);
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  };

  const deleteDeal = async (dealId: string) => {
    try {
      await supabase.from('deals').delete().eq('id', dealId);
      const updatedDeals = await fetchDeals();
      setDeals(updatedDeals);
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  };

  return (
    <DealsContext.Provider value={{ deals, addDeal, updateDeal, deleteDeal, isLoading }}>
      {children}
    </DealsContext.Provider>
  );
}

export function useDeals() {
  const context = useContext(DealsContext);
  if (context === undefined) {
    throw new Error('useDeals must be used within a DealsProvider');
  }
  return context;
} 