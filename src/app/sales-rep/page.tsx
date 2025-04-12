/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { useDeals } from '@/contexts/DealsContext';
import { Deal, DealStage } from '@/types';
import Image from 'next/image';
import { STORAGE_BUCKETS, getImageUrl } from '@/lib/supabase';

export default function SalesRepPage() {
  const { deals } = useDeals();
  const [selectedRep, setSelectedRep] = useState<string | null>(null);

  const reps = Array.from(new Set(deals.map(deal => deal.owner)));
  
  const getRepStats = (rep: string) => {
    const repDeals = deals.filter(deal => deal.owner === rep);
    const totalArr = repDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const totalRaas = repDeals.reduce((sum, deal) => sum + deal.raas, 0);
    const wonDeals = repDeals.filter(deal => deal.stage === 'Won');
    const wonArr = wonDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const wonRaas = wonDeals.reduce((sum, deal) => sum + deal.raas, 0);
    
    return {
      totalDeals: repDeals.length,
      totalArr,
      totalRaas,
      wonDeals: wonDeals.length,
      wonArr,
      wonRaas,
      winRate: repDeals.length ? (wonDeals.length / repDeals.length) * 100 : 0
    };
  };

  const getRepDeals = (rep: string): Deal[] => {
    return deals.filter(deal => deal.owner === rep);
  };

  const getOwnerImagePath = (owner: string) => {
    const normalizedOwner = owner.toLowerCase();
    return getImageUrl(STORAGE_BUCKETS.OWNERS, `${normalizedOwner}.png`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; // Prevent infinite loop
    console.error(`Failed to load image: ${target.src}`);
    target.src = 'https://api.dicebear.com/7.x/avatars/svg?seed=fallback';
  };

  const getRepStage = (rep: string): DealStage => {
    const repDeals = deals.filter(deal => deal.owner === rep);
    if (repDeals.some(deal => deal.stage === 'Won')) return 'Won';
    if (repDeals.some(deal => deal.stage === 'Closing')) return 'Closing';
    if (repDeals.some(deal => deal.stage === "Demo'd")) return "Demo'd";
    return 'Lost';
  };

  return (
    <div className="px-1 py-8">
      <h1 className="text-3xl font-bold mb-8 px-1">Reps</h1>
      
      <div className="flex gap-3 pb-6 justify-center">
        {reps.map(rep => {
          const stats = getRepStats(rep);
          const isSelected = selectedRep === rep;
          const stage = getRepStage(rep);
          
          return (
            <div 
              key={rep}
              className={`bg-white rounded-lg border p-6 cursor-pointer transition-all w-[260px] ${
                isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedRep(isSelected ? null : rep)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={getOwnerImagePath(rep)}
                    alt={rep}
                    width={48}
                    height={48}
                    className="object-cover"
                    onError={handleImageError}
                  />
                </div>
                <h2 className="text-xl font-semibold">{rep}</h2>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-600">
                  Total Deals: <span className="font-medium">{stats.totalDeals}</span>
                </p>
                <p className="text-gray-600">
                  Won Deals: <span className="font-medium">{stats.wonDeals}</span>
                </p>
                <p className="text-gray-600">
                  Win Rate: <span className="font-medium">{stats.winRate.toFixed(1)}%</span>
                </p>
                <p className="text-gray-600">
                  Total ARR: <span className="font-medium">${stats.totalArr.toLocaleString()}</span>
                </p>
                <p className="text-gray-600">
                  Won ARR: <span className="font-medium">${stats.wonArr.toLocaleString()}</span>
                </p>
              </div>

              {isSelected && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Rep&apos;s Deals</h3>
                  <div className="space-y-2">
                    {getRepDeals(rep).map(deal => (
                      <div key={deal.id} className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{deal.company}</p>
                            <p className="text-sm text-gray-600">
                              ${deal.amount.toLocaleString()} ARR
                            </p>
                          </div>
                          <span className={`text-sm ${
                            deal.stage === 'Won' ? 'text-green-600' : 
                            deal.stage === 'Lost' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {deal.stage}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 