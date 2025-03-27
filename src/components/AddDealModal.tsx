'use client';

import { useState } from 'react';
import { Deal, Owner, Product } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (deal: Deal) => Promise<void>;
}

const OWNERS: Owner[] = ['Hasan', 'Jared', 'Guillermo', 'Ricardo', 'Kamran'];
const PRODUCTS: Product[] = ['Kayako', 'Influitive', 'Agents', 'CRMagic', 'Ephor', 'AI Caller'];

export default function AddDealModal({ isOpen, onClose, onAdd }: AddDealModalProps) {
  const [formData, setFormData] = useState({
    company: '',
    amount: '',
    owner: 'Hasan' as Owner,
    product: 'Kayako' as Product,
    raas: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    setError(null);
    setIsSubmitting(true);
    
    console.log('Form data:', formData);
    
    const newDeal: Deal = {
      id: uuidv4(),
      company: formData.company,
      amount: parseFloat(formData.amount) || 0,
      owner: formData.owner,
      product: formData.product,
      stage: "Demo'd",
      raas: parseFloat(formData.raas) || 0,
      demo_date: new Date(),
      summary: '',
      updatedAt: new Date()
    };

    console.log('Created new deal object:', newDeal);

    try {
      console.log('Calling onAdd function...');
      await onAdd(newDeal);
      console.log('Deal added successfully');
      onClose();
      setFormData({
        company: '',
        amount: '',
        owner: 'Hasan',
        product: 'Kayako',
        raas: ''
      });
    } catch (error) {
      console.error('Error adding deal:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        setError(error.message);
      } else {
        setError('An unexpected error occurred while adding the deal');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Deal</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">RaaS</label>
            <input
              type="number"
              value={formData.raas}
              onChange={(e) => setFormData({ ...formData, raas: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Owner</label>
            <select
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value as Owner })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {OWNERS.map((owner) => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value as Product })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {PRODUCTS.map((product) => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>
          <div className="mt-6 px-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? 'Adding...' : 'Add Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 