'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import { DealsProvider } from '@/contexts/DealsContext'
import { useState } from 'react';
import AddDealModal from '@/components/AddDealModal';
import { useDeals } from '@/contexts/DealsContext';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const { addDeal } = useDeals();

  return (
    <html lang="en">
      <body className={inter.className}>
        <DealsProvider>
          <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
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
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsAddDealModalOpen(true)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Deal
                    </button>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      title="Import"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </button>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      title="Export"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </main>
            <AddDealModal
              isOpen={isAddDealModalOpen}
              onClose={() => setIsAddDealModalOpen(false)}
              onAdd={addDeal}
            />
          </div>
        </DealsProvider>
      </body>
    </html>
  )
}
