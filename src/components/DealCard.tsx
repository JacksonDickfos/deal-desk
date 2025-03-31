'use client';

import { Deal } from '@/types';
import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import DealSummaryModal from './DealSummaryModal';
import EditDealModal from './EditDealModal';
import { differenceInDays } from 'date-fns';

interface DealCardProps {
  deal: Deal;
  onDealUpdate: (deal: Deal) => void;
}

export default function DealCard({ deal, onDealUpdate }: DealCardProps) {
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getDaysSinceDemo = (demoDate: Date) => {
    const days = differenceInDays(new Date(), new Date(demoDate));
    return days < 1 ? '0 days' : `${days} days`;
  };

  const getProductImagePath = (product: string) => {
    const normalizedProduct = product.toLowerCase().replace(/\s+/g, '-');
    return `/static/products/${normalizedProduct}.png`;
  };

  const getOwnerImagePath = (owner: string) => {
    return `/static/owners/${owner.toLowerCase()}.png`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; // Prevent infinite loop
    console.error(`Failed to load image: ${target.src}`);
    target.src = '/static/placeholder.png';
  };

  return (
    <>
      <div 
        className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
          deal.stage === 'Won' ? 'border-blue-600' : 'border-gray-200'
        }`}
        onClick={() => setIsSummaryModalOpen(true)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900">{deal.company}</h3>
            <div className="mt-1 text-sm text-gray-600">
              ARR: ${deal.amount.toLocaleString()}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              RaaS: ${deal.raas.toLocaleString()}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-between items-center mt-2">
          {deal.demo_date && (
            <span className="text-sm text-gray-500">
              {getDaysSinceDemo(deal.demo_date)}
            </span>
          )}
          <div className="flex gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100" title={`Product: ${deal.product}`}>
              <img
                src={getProductImagePath(deal.product)}
                alt={deal.product}
                className="w-8 h-8 object-cover"
                onError={handleImageError}
              />
            </div>
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100" title={`Owner: ${deal.owner}`}>
              <img
                src={getOwnerImagePath(deal.owner)}
                alt={deal.owner}
                className="w-8 h-8 object-cover"
                onError={handleImageError}
              />
            </div>
          </div>
        </div>
      </div>

      <DealSummaryModal
        deal={deal}
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        onSave={onDealUpdate}
      />

      <EditDealModal
        deal={deal}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onDealUpdate}
      />
    </>
  );
}
