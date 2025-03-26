'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Deal } from '@/types';

interface DealsContextType {
  deals: Deal[];
  addDeal: (deal: Deal) => void;
  updateDeal: (deal: Deal) => void;
  deleteDeal: (dealId: string) => void;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export function DealsProvider({ children }: { children: ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    const savedDeals = localStorage.getItem('deals');
    if (savedDeals) {
      setDeals(JSON.parse(savedDeals));
    }
  }, []);

  const addDeal = (newDeal: Deal) => {
    const updatedDeals = [...deals, newDeal];
    setDeals(updatedDeals);
    localStorage.setItem('deals', JSON.stringify(updatedDeals));
  };

  const updateDeal = (updatedDeal: Deal) => {
    const updatedDeals = deals.map(deal => 
      deal.id === updatedDeal.id ? updatedDeal : deal
    );
    setDeals(updatedDeals);
    localStorage.setItem('deals', JSON.stringify(updatedDeals));
  };

  const deleteDeal = (dealId: string) => {
    const updatedDeals = deals.filter(deal => deal.id !== dealId);
    setDeals(updatedDeals);
    localStorage.setItem('deals', JSON.stringify(updatedDeals));
  };

  return (
    <DealsContext.Provider value={{ deals, addDeal, updateDeal, deleteDeal }}>
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