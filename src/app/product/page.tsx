'use client';

import { useState } from 'react';
import { useDeals } from '@/contexts/DealsContext';
import { Deal, Product } from '@/types';
import Image from 'next/image';

export default function ProductPage() {
  const { deals } = useDeals();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products = Array.from(new Set(deals.map(deal => deal.product)));
  
  const getProductStats = (product: Product) => {
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

  const getProductDeals = (product: Product): Deal[] => {
    return deals.filter(deal => deal.product === product);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => {
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
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={`/images/products/${product.toLowerCase()}.png`}
                    alt={product}
                    fill
                    className="object-cover"
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

              {isSelected && (
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