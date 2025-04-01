'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import { DealsProvider } from '@/contexts/DealsContext'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DealsProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </DealsProvider>
      </body>
    </html>
  )
}
