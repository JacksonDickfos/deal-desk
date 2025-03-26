import { useState } from 'react';
import { parseDealInput } from '@/utils/dealParser';
import { Deal } from '@/types';

interface AddDealInputProps {
  onAddDeal: (deal: Deal) => void;
}

export default function AddDealInput({ onAddDeal }: AddDealInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parsedDeal = parseDealInput(input);
    if (!parsedDeal.name || !parsedDeal.amount || !parsedDeal.owner || !parsedDeal.product) {
      alert('Please provide all required information: Deal Name, Amount, Owner, and Product');
      return;
    }

    const newDeal: Deal = {
      id: Date.now().toString(),
      ...parsedDeal as Required<typeof parsedDeal>,
    };

    onAddDeal(newDeal);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter deal details (e.g., 'Acme Corp $50000 Hasan Kayako')"
          className="flex-1 p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-app-purple focus:border-app-purple"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-app-purple text-white rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-purple"
        >
          Add Deal
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Format: Deal Name Amount Owner Product (e.g., "Acme Corp $50000 Hasan Kayako")
      </p>
    </form>
  );
}
