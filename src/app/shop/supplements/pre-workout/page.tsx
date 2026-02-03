'use client'

import { Suspense } from 'react'
import ProductGrid from '@/components/shop/ProductGrid'
import ShopCategoryNav from '@/components/shop/ShopCategoryNav'

function PreWorkoutContent() {
  return (
    <>
      {/* Header */}
      <div className="bg-zinc-900 text-white py-8 sm:py-12 lg:py-16 border-b border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4">Pre-Workout</h1>
            <p className="text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed">
              Energy, focus, and performance. Maximize your training potential.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ShopCategoryNav />

      {/* Products */}
      <div className="bg-zinc-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <ProductGrid filters={{ category: 'supplements', subcategory: 'Pre-Workout', sizes: [], priceRange: null, inStockOnly: false }} />
        </div>
      </div>
    </>
  )
}

export default function PreWorkoutPage() {
  return (
    <div className="min-h-screen pt-20">
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
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
        <PreWorkoutContent />
      </Suspense>
    </div>
  )
}
