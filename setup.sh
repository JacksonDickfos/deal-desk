#!/bin/bash

# Create necessary directories
mkdir -p src/types src/components src/utils src/app/product src/app/sales-rep public/images

# Create types/index.ts
cat > src/types/index.ts << 'EOL'
export type DealStage = "Demo'd" | "Closing" | "Won" | "Lost";
export type Owner = "Hasan" | "Jared" | "Guillermo" | "Ricardo" | "Kamran";
export type Product = "Kayako" | "Influitive" | "Agents" | "CRMagic" | "Ephor";

export interface Deal {
  id: string;
  name: string;
  amount: number;
  owner: Owner;
  product: Product;
  stage: DealStage;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ColumnStats {
  deals: number;
  amount: number;
  forecast: number;
}

export interface OwnerProfile {
  name: Owner;
  imageUrl?: string;
  deals: Deal[];
}

export interface ProductProfile {
  name: Product;
  imageUrl?: string;
  deals: Deal[];
}
EOL

# Create utils/dealParser.ts
cat > src/utils/dealParser.ts << 'EOL'
import { Deal, Owner, Product } from '@/types';

const OWNERS: Owner[] = ['Hasan', 'Jared', 'Guillermo', 'Ricardo', 'Kamran'];
const PRODUCTS: Product[] = ['Kayako', 'Influitive', 'Agents', 'CRMagic', 'Ephor'];

export function parseDealInput(input: string): Partial<Deal> {
  const words = input.split(' ');
  const result: Partial<Deal> = {
    name: '',
    amount: 0,
    owner: undefined,
    product: undefined,
    stage: "Demo'd",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Find owner
  for (const word of words) {
    if (OWNERS.includes(word as Owner)) {
      result.owner = word as Owner;
      break;
    }
  }

  // Find product
  for (const word of words) {
    if (PRODUCTS.includes(word as Product)) {
      result.product = word as Product;
      break;
    }
  }

  // Find amount
  const amountMatch = input.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
  if (amountMatch) {
    result.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // The rest is the deal name
  const nameParts = words.filter(word => 
    !OWNERS.includes(word as Owner) && 
    !PRODUCTS.includes(word as Product) && 
    !amountMatch?.includes(word)
  );
  result.name = nameParts.join(' ');

  return result;
}
EOL

# Create components/DealCard.tsx
cat > src/components/DealCard.tsx << 'EOL'
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
EOL

# Create components/AddDealInput.tsx
cat > src/components/AddDealInput.tsx << 'EOL'
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
EOL

# Create components/KanbanBoard.tsx
cat > src/components/KanbanBoard.tsx << 'EOL'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Deal, DealStage, ColumnStats } from '@/types';
import { useState, useEffect } from 'react';
import DealCard from './DealCard';

const STAGES: DealStage[] = ["Demo'd", 'Closing', 'Won', 'Lost'];
const FORECAST_PERCENTAGES = {
  "Demo'd": 0.2,
  'Closing': 0.5,
  'Won': 1,
  'Lost': 0.02
};

export default function KanbanBoard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [columns, setColumns] = useState<Record<DealStage, Deal[]>>({
    "Demo'd": [],
    'Closing': [],
    'Won': [],
    'Lost': []
  });

  useEffect(() => {
    const savedDeals = localStorage.getItem('deals');
    if (savedDeals) {
      const parsedDeals = JSON.parse(savedDeals);
      setDeals(parsedDeals);
      updateColumns(parsedDeals);
    }
  }, []);

  const updateColumns = (deals: Deal[]) => {
    const newColumns = deals.reduce((acc, deal) => {
      acc[deal.stage].push(deal);
      return acc;
    }, { "Demo'd": [], 'Closing': [], 'Won': [], 'Lost': [] } as Record<DealStage, Deal[]>);
    setColumns(newColumns);
  };

  const calculateColumnStats = (stage: DealStage): ColumnStats => {
    const columnDeals = columns[stage];
    const deals = columnDeals.length;
    const amount = columnDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const forecast = amount * FORECAST_PERCENTAGES[stage];
    return { deals, amount, forecast };
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const deal = deals.find(d => d.id === draggableId);
    if (!deal) return;

    const newDeals = deals.map(d => {
      if (d.id === draggableId) {
        return { ...d, stage: destination.droppableId as DealStage };
      }
      return d;
    });

    setDeals(newDeals);
    updateColumns(newDeals);
    localStorage.setItem('deals', JSON.stringify(newDeals));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 p-6 overflow-x-auto">
        {STAGES.map(stage => {
          const stats = calculateColumnStats(stage);
          return (
            <div key={stage} className="kanban-column">
              <div className="column-header">{stage}</div>
              <div className="column-stats">
                <div>Deals: {stats.deals}</div>
                <div>Amount: ${stats.amount.toLocaleString()}</div>
                <div className={stage === 'Won' ? 'amount-won' : ''}>
                  {stage === 'Won' ? 'Total Won' : `Forecast (${(FORECAST_PERCENTAGES[stage] * 100).toFixed(0)}%)`}: 
                  ${stats.forecast.toLocaleString()}
                </div>
              </div>
              <Droppable droppableId={stage}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {columns[stage].map((deal, index) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <DealCard deal={deal} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
EOL

# Create app/page.tsx
cat > src/app/page.tsx << 'EOL'
'use client';

import KanbanBoard from '@/components/KanbanBoard';
import AddDealInput from '@/components/AddDealInput';
import { Deal } from '@/types';
import { useState, useEffect } from 'react';

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    const savedDeals = localStorage.getItem('deals');
    if (savedDeals) {
      setDeals(JSON.parse(savedDeals));
    }
  }, []);

  const handleAddDeal = (newDeal: Deal) => {
    const updatedDeals = [...deals, newDeal];
    setDeals(updatedDeals);
    localStorage.setItem('deals', JSON.stringify(updatedDeals));
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deal Desk</h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            Import
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export
          </button>
        </div>
      </div>
      <AddDealInput onAddDeal={handleAddDeal} />
      <KanbanBoard />
    </div>
  );
}
EOL

# Create app/layout.tsx
cat > src/app/layout.tsx << 'EOL'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Deal Desk',
  description: 'Deal Desk Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <span className="text-xl font-bold text-app-purple">Deal Desk</span>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Kanban Board
                    </a>
                    <a href="/sales-rep" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      By Sales Rep
                    </a>
                    <a href="/product" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      By Product
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
EOL

# Create app/globals.css
cat > src/app/globals.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}

.deal-card {
  @apply bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer transition-all duration-200 hover:shadow-lg;
}

.deal-card.won {
  @apply border-2 border-green-500;
}

.deal-card.lost {
  @apply border-2 border-red-500;
}

.kanban-column {
  @apply bg-gray-50 rounded-lg p-4 min-h-[calc(100vh-12rem)] w-80;
}

.column-header {
  @apply text-lg font-semibold mb-4 text-gray-700;
}

.column-stats {
  @apply text-sm text-gray-600 mb-4;
}

.amount-won {
  @apply font-bold text-app-purple;
}
EOL

# Create placeholder image
cat > public/images/placeholder.jpg << 'EOL'
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyVC08MTY3LjIyOUFTRjo/Tj4yMkhiSzhLTE0yMTAyMjIyMjIyMjL/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=
EOL

# Update tailwind.config.js
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'app-purple': '#6B46C1',
      },
    },
  },
  plugins: [],
}
EOL

# Make the script executable
chmod +x setup.sh
