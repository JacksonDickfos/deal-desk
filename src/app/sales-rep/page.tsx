'use client';

import { Owner, Deal } from '@/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const OWNERS: Owner[] = ['Hasan', 'Jared', 'Guillermo', 'Ricardo', 'Kamran'];

export default function SalesRepPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  useEffect(() => {
    const savedDeals = localStorage.getItem('deals');
    if (savedDeals) {
      setDeals(JSON.parse(savedDeals));
    }
  }, []);

  const handleImageUpload = async (owner: Owner, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload this to a server
    // For now, we'll just store the file name in localStorage
    localStorage.setItem(`owner-image-${owner}`, file.name);
  };

  const getOwnerDeals = (owner: Owner) => {
    return deals.filter(deal => deal.owner === owner);
  };

  const getOwnerStats = (owner: Owner) => {
    const ownerDeals = getOwnerDeals(owner);
    return {
      totalDeals: ownerDeals.length,
      totalAmount: ownerDeals.reduce((sum, deal) => sum + deal.amount, 0),
      wonDeals: ownerDeals.filter(deal => deal.stage === 'Won').length,
      lostDeals: ownerDeals.filter(deal => deal.stage === 'Lost').length,
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">By Sales Rep</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OWNERS.map(owner => {
          const stats = getOwnerStats(owner);
          const imageUrl = localStorage.getItem(`owner-image-${owner}`) || '/images/placeholder.jpg';

          return (
            <div
              key={owner}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedOwner(owner)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={owner}
                    fill
                    className="object-cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(owner, e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{owner}</h2>
                  <p className="text-gray-600">{stats.totalDeals} deals</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg font-semibold">${stats.totalAmount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Won Deals</p>
                  <p className="text-lg font-semibold text-green-600">{stats.wonDeals}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Lost Deals</p>
                  <p className="text-lg font-semibold text-red-600">{stats.lostDeals}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedOwner && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">{selectedOwner}'s Deals</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deal Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getOwnerDeals(selectedOwner).map(deal => (
                    <tr key={deal.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{deal.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${deal.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deal.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          deal.stage === 'Won' ? 'bg-green-100 text-green-800' :
                          deal.stage === 'Lost' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {deal.stage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 