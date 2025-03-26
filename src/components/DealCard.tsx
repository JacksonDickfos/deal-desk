import { Deal } from '@/types';
import { useState } from 'react';
import Image from 'next/image';

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editedDeal, setEditedDeal] = useState(deal);

  const handleSave = () => {
    const savedDeals = JSON.parse(localStorage.getItem('deals') || '[]');
    const updatedDeals = savedDeals.map((d: Deal) => 
      d.id === deal.id ? editedDeal : d
    );
    localStorage.setItem('deals', JSON.stringify(updatedDeals));
    setIsEditing(false);
  };

  return (
    <div className={`deal-card ${deal.stage === 'Won' ? 'won' : deal.stage === 'Lost' ? 'lost' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedDeal.name}
              onChange={(e) => setEditedDeal({ ...editedDeal, name: e.target.value })}
              className="w-full p-1 border rounded"
            />
          ) : (
            <h3 className="font-semibold">{deal.name}</h3>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          {isEditing ? (
            <input
              type="number"
              value={editedDeal.amount}
              onChange={(e) => setEditedDeal({ ...editedDeal, amount: Number(e.target.value) })}
              className="w-full p-1 border rounded"
            />
          ) : (
            <p className="text-gray-600">${deal.amount.toLocaleString()}</p>
          )}
        </div>

        <div>
          {isEditing ? (
            <select
              value={editedDeal.owner}
              onChange={(e) => setEditedDeal({ ...editedDeal, owner: e.target.value as Deal['owner'] })}
              className="w-full p-1 border rounded"
            >
              {['Hasan', 'Jared', 'Guillermo', 'Ricardo', 'Kamran'].map(owner => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>
          ) : (
            <div className="flex items-center space-x-2">
              <p className="text-gray-600">{deal.owner}</p>
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={`/images/${deal.owner.toLowerCase()}.jpg`}
                  alt={deal.owner}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          {isEditing ? (
            <select
              value={editedDeal.product}
              onChange={(e) => setEditedDeal({ ...editedDeal, product: e.target.value as Deal['product'] })}
              className="w-full p-1 border rounded"
            >
              {['Kayako', 'Influitive', 'Agents', 'CRMagic', 'Ephor'].map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          ) : (
            <div className="flex items-center space-x-2">
              <p className="text-gray-600">{deal.product}</p>
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={`/images/${deal.product.toLowerCase()}.jpg`}
                  alt={deal.product}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm bg-app-purple text-white rounded hover:bg-opacity-90"
          >
            Save
          </button>
        </div>
      )}

      {showDetails && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold mb-2">Deal Summary</h4>
          <textarea
            value={deal.summary || ''}
            onChange={(e) => setEditedDeal({ ...editedDeal, summary: e.target.value })}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Add deal summary..."
          />
        </div>
      )}
    </div>
  );
}
