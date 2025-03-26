'use client';

import KanbanBoard from '@/components/KanbanBoard';
import AddDealInput from '@/components/AddDealInput';
import { Deal } from '@/types';
import { useState, useEffect } from 'react';

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    const savedDeals = localStorage.getItem('deals');
    if (savedDeals) {
      setDeals(JSON.parse(savedDeals));
    }
  }, []);

  const handleAddDeal = (newDeal: Deal) => {
    const updatedDeals = [...deals, newDeal];
    setDeals(updatedDeals);
    localStorage.setItem('deals', JSON.stringify(updatedDeals));
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deal Desk</h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            Import
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export
          </button>
        </div>
      </div>
      <AddDealInput onAddDeal={handleAddDeal} />
      <KanbanBoard />
    </div>
  );
}
