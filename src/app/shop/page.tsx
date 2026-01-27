'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ShopHeader from '@/components/shop/ShopHeader'
import ProductGrid from '@/components/shop/ProductGrid'
import ShopFilters from '@/components/shop/ShopFilters'

function ShopContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [filters, setFilters] = useState({
    category: 'All',
    sizes: [] as string[],
    priceRange: null as { min: number; max: number } | null,
    inStockOnly: false,
  })

  // Update filters when URL parameters change
  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }))
    }
  }, [categoryParam])

  return (
    <>
      <ShopHeader />
      <div className="container-custom section-padding">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <ShopFilters filters={filters} setFilters={setFilters} />
          </aside>
          
          {/* Product Grid */}
          <main className="flex-1">
            <ProductGrid filters={filters} />
          </main>
        </div>
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
