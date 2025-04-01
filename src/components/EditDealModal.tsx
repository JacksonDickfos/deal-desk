'use client';

import { Deal, Owner, Product } from '@/types';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface EditDealModalProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDeal: Deal) => void;
}

const OWNERS: Owner[] = ['Hasan', 'Jared', 'Guillermo', 'Ricardo', 'Kamran'];
const PRODUCTS: Product[] = ['Kayako', 'Influitive', 'Agents', 'CRMagic', 'Ephor'];

export default function EditDealModal({ deal, isOpen, onClose, onSave }: EditDealModalProps) {
  const [editedDeal, setEditedDeal] = useState<Deal>({ ...deal });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      ...editedDeal,
      updated_at: new Date()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Deal</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deal Name
            </label>
            <input
              type="text"
              value={editedDeal.company}
              onChange={(e) => setEditedDeal({ ...editedDeal, company: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={editedDeal.amount}
              onChange={(e) => setEditedDeal({ ...editedDeal, amount: Number(e.target.value) })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RaaS
            </label>
            <input
              type="number"
              value={editedDeal.raas}
              onChange={(e) => setEditedDeal({ ...editedDeal, raas: Number(e.target.value) })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Demo Date
            </label>
            <input
              type="date"
              value={editedDeal.demo_date ? new Date(editedDeal.demo_date).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditedDeal({ 
                ...editedDeal, 
                demo_date: e.target.value ? new Date(e.target.value) : new Date() 
              })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner
            </label>
            <select
              value={editedDeal.owner}
              onChange={(e) => setEditedDeal({ ...editedDeal, owner: e.target.value as Owner })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {OWNERS.map(owner => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              value={editedDeal.product}
              onChange={(e) => setEditedDeal({ ...editedDeal, product: e.target.value as Product })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {PRODUCTS.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-6"
        >
          Update Deal
        </button>
      </div>
    </div>
  );
} 