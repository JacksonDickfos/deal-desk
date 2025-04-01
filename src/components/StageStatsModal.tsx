'use client';

import { DealStage } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface StageStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: DealStage;
  stats: {
    dealsCount: number;
    arr: number;
    raas: number;
    combinedForecast: number;
  };
  forecastPercentage: number;
}

export default function StageStatsModal({ isOpen, onClose, stage, stats, forecastPercentage }: StageStatsModalProps) {
  if (!isOpen) return null;

  const isWonColumn = stage === 'Won';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{stage} Stage Forecast</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {isWonColumn ? 'Total Forecasted Value' : `Forecasted Value (${forecastPercentage * 100}%)`}
            </h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                Combined Forecast (ARR + RaaS):{' '}
                <span className={`font-bold ${isWonColumn ? 'text-purple-600' : ''}`}>
                  ${stats.combinedForecast.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 