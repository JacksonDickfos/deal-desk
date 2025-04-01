'use client';

import { useState } from 'react';
import { useDeals } from '@/contexts/DealsContext';
import { Deal, Product } from '@/types';
import Image from 'next/image';
import { STORAGE_BUCKETS, getImageUrl } from '@/lib/supabase';

// Define all available products
const ALL_PRODUCTS: Product[] = ['Kayako', 'Influitive', 'Agents', 'CRMagic', 'Ephor'];

export default function ProductPage() {
  const { deals } = useDeals();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  const getProductStats = (product: string) => {
    const productDeals = deals.filter(deal => deal.product === product);
    const totalArr = productDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const totalRaas = productDeals.reduce((sum, deal) => sum + deal.raas, 0);
    const wonDeals = productDeals.filter(deal => deal.stage === 'Won');
    const wonArr = wonDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const wonRaas = wonDeals.reduce((sum, deal) => sum + deal.raas, 0);
    
    return {
      totalDeals: productDeals.length,
      totalArr,
      totalRaas,
      wonDeals: wonDeals.length,
      wonArr,
      wonRaas,
      winRate: productDeals.length ? (wonDeals.length / productDeals.length) * 100 : 0
    };
  };

  const getProductDeals = (product: string): Deal[] => {
    return deals.filter(deal => deal.product === product);
  };

  const getProductImagePath = (product: string) => {
    const normalizedProduct = product.toLowerCase().replace(/\s+/g, '-');
    return getImageUrl(STORAGE_BUCKETS.PRODUCTS, `${normalizedProduct}.png`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; // Prevent infinite loop
    console.error(`Failed to load image: ${target.src}`);
    target.src = 'https://api.dicebear.com/7.x/avatars/svg?seed=fallback';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_PRODUCTS.map(product => {
          const stats = getProductStats(product);
          const isSelected = selectedProduct === product;
          
          return (
            <div 
              key={product}
              className={`bg-white rounded-lg border p-6 cursor-pointer transition-all ${
                isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedProduct(isSelected ? null : product)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <Image
                    src={getProductImagePath(product)}
                    alt={product}
                    width={48}
                    height={48}
                    className="object-contain"
                    onError={handleImageError}
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                    unoptimized
                    loading="eager"
                    priority={true}
                  />
                </div>
                <h2 className="text-xl font-semibold">{product}</h2>
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

              {isSelected && stats.totalDeals > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Product Deals</h3>
                  <div className="space-y-2">
                    {getProductDeals(product).map(deal => (
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