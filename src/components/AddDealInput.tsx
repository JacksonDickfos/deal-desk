'use client';

import { useState } from 'react';
import { Deal, DealStage } from '@/types';
import { useDeals } from '@/contexts/DealsContext';

export default function AddDealInput() {
  const { addDeal } = useDeals();
  const [company, setCompany] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    const newDeal: Deal = {
      id: Math.random().toString(36).substr(2, 9),
      company: company.trim(),
      amount: 0,
      raas: 0,
      owner: 'Hasan',
      product: 'Kayako',
      stage: "Demo'd",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addDeal(newDeal);
    setCompany('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-4">
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Add new deal..."
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Deal
        </button>
      </div>
    </form>
  );
}
