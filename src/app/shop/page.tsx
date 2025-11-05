'use client'

import { useState } from 'react'
import ShopHeader from '@/components/shop/ShopHeader'
import ProductGrid from '@/components/shop/ProductGrid'
import ShopFilters from '@/components/shop/ShopFilters'

export default function ShopPage() {
  const [filters, setFilters] = useState({
    category: 'All',
    sizes: [] as string[],
    priceRange: null as { min: number; max: number } | null,
    inStockOnly: false,
  })

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
