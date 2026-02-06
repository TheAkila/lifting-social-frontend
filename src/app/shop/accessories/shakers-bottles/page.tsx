'use client'

import { Suspense } from 'react'
import ProductGrid from '@/components/shop/ProductGrid'
import ShopCategoryNav from '@/components/shop/ShopCategoryNav'

function ShakersBottlesContent() {
  return (
    <>
      <div className="bg-zinc-900 text-white py-8 sm:py-12 lg:py-16 border-b border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4">Shakers & Bottles</h1>
            <p className="text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed">
              Protein shakers and water bottles. Mix supplements and stay hydrated during your workouts.
            </p>
          </div>
        </div>
      </div>

      <ShopCategoryNav />

      <div className="bg-zinc-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <ProductGrid filters={{ category: 'accessories', subcategory: 'Shakers/Bottles', sizes: [], priceRange: null, inStockOnly: false }} />
        </div>
      </div>
    </>
  )
}

export default function ShakersBottlesPage() {
  return <div className="min-h-screen pt-20"><Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="animate-pulse"><div className="h-32 bg-zinc-200 rounded-lg mb-8" /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="bg-zinc-200 rounded-lg aspect-square" />))}</div></div></div>}><ShakersBottlesContent /></Suspense></div>
}
