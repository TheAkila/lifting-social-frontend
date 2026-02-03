'use client'

import { Suspense } from 'react'
import ProductGrid from '@/components/shop/ProductGrid'
import ShopCategoryNav from '@/components/shop/ShopCategoryNav'

function GripsContent() {
  return (
    <>
      <div className="bg-zinc-900 text-white py-6 sm:py-8 md:py-12 lg:py-16 border-b border-zinc-800">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">Grips</h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-zinc-400 leading-relaxed">
              Training grips and grip aids. Better control and comfort for pulling exercises.
            </p>
          </div>
        </div>
      </div>

      <ShopCategoryNav />

      <div className="bg-zinc-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <ProductGrid filters={{ category: 'accessories', subcategory: 'Grips', sizes: [], priceRange: null, inStockOnly: false }} />
        </div>
      </div>
    </>
  )
}

export default function GripsPage() {
  return <div className="min-h-screen pt-20"><Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="animate-pulse"><div className="h-32 bg-zinc-200 rounded-lg mb-8" /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="bg-zinc-200 rounded-lg aspect-square" />))}</div></div></div>}><GripsContent /></Suspense></div>
}
