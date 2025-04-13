'use client';

import { useState } from 'react';
import { useDeals } from '@/contexts/DealsContext';
import AddDealModal from './AddDealModal';

export default function Header() {
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const { addDeal } = useDeals();

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="pl-5 pr-5">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-app-purple">NCA Deal Desk</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Deals
                </a>
                <a href="/sales-rep" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Reps
                </a>
                <a href="/product" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Products
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAddDealModalOpen(true)}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 h-9"
              >
                Add Deal
              </button>
            </div>
          </div>
        </div>
      </nav>
      <AddDealModal
        isOpen={isAddDealModalOpen}
        onClose={() => setIsAddDealModalOpen(false)}
        onAdd={addDeal}
      />
    </>
  );
} 