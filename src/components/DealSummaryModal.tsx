'use client';

import { Deal } from '@/types';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DealSummaryModalProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDeal: Deal) => void;
}

export default function DealSummaryModal({ deal, isOpen, onClose, onSave }: DealSummaryModalProps) {
  const [summary, setSummary] = useState(deal.summary || '');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      ...deal,
      summary,
      updated_at: new Date()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{deal.company}</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="mb-4">
          <div className="mb-2">Owner: {deal.owner}</div>
          <div className="mb-2">Product: {deal.product}</div>
          <div className="mb-2">Amount: ${deal.amount.toLocaleString()}</div>
          <div className="mb-4">Stage: {deal.stage}</div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Deal Summary</h3>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full h-32 p-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add deal summary..."
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
} 