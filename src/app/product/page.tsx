'use client';

import { Product, Deal } from '@/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const PRODUCTS: Product[] = ['Kayako', 'Influitive', 'Agents', 'CRMagic', 'Ephor'];

export default function ProductPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const savedDeals = localStorage.getItem('deals');
    if (savedDeals) {
      setDeals(JSON.parse(savedDeals));
    }
  }, []);

  const handleImageUpload = async (product: Product, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload this to a server
    // For now, we'll just store the file name in localStorage
    localStorage.setItem(`product-image-${product}`, file.name);
  };

  const getProductDeals = (product: Product) => {
    return deals.filter(deal => deal.product === product);
  };

  const getProductStats = (product: Product) => {
    const productDeals = getProductDeals(product);
    return {
      totalDeals: productDeals.length,
      totalAmount: productDeals.reduce((sum, deal) => sum + deal.amount, 0),
      wonDeals: productDeals.filter(deal => deal.stage === 'Won').length,
      lostDeals: productDeals.filter(deal => deal.stage === 'Lost').length,
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">By Product</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map(product => {
          const stats = getProductStats(product);
          const imageUrl = localStorage.getItem(`product-image-${product}`) || '/images/placeholder.jpg';

          return (
            <div
              key={product}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={product}
                    fill
                    className="object-cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(product, e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{product}</h2>
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

      {selectedProduct && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">{selectedProduct} Deals</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deal Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getProductDeals(selectedProduct).map(deal => (
                    <tr key={deal.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{deal.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${deal.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deal.owner}</td>
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