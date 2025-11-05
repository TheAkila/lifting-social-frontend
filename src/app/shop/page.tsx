'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ShopHeader from '@/components/shop/ShopHeader'
import ProductGrid from '@/components/shop/ProductGrid'
import ShopFilters from '@/components/shop/ShopFilters'

export default function ShopPage() {
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
    <div className="min-h-screen pt-20">
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
    </div>
  )
}
