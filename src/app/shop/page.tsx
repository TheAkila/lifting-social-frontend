'use client'

import { Suspense } from 'react'
import ShopHeader from '@/components/shop/ShopHeader'
import ProductGrid from '@/components/shop/ProductGrid'

function ShopContent() {
  return (
    <>
      <ShopHeader />
      <div className="container-custom section-padding">
        {/* Product Grid */}
        <main>
          <ProductGrid filters={{ category: 'All', sizes: [], priceRange: null, inStockOnly: false }} />
        </main>
      </div>
    </>
  )
}

export default function ShopPage() {
  return (
    <div className="min-h-screen pt-20">
      <Suspense fallback={
        <div className="container-custom section-padding">
          <div className="animate-pulse">
            <div className="h-32 bg-zinc-200 rounded-lg mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-zinc-200 rounded-lg aspect-square" />
              ))}
            </div>
          </div>
        </div>
      }>
        <ShopContent />
      </Suspense>
    </div>
  )
}
