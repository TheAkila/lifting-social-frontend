'use client'

import { Suspense } from 'react'
import ShopHeader from '@/components/shop/ShopHeader'
import ShopCategoryNav from '@/components/shop/ShopCategoryNav'
import ProductGrid from '@/components/shop/ProductGrid'
import FeaturedProducts from '@/components/shop/FeaturedProducts'
import OffersDeals from '@/components/shop/OffersDeals'
import RecentlyViewed from '@/components/shop/RecentlyViewed'

function ShopContent() {
  return (
    <>
      <ShopHeader />
      <ShopCategoryNav />
      
      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* All Products Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-zinc-900 mb-2">
              All Products
            </h2>
            <p className="text-sm sm:text-base text-zinc-600">
              Browse our complete collection
            </p>
          </div>
          
          <main>
            <ProductGrid filters={{ category: 'All', sizes: [], priceRange: null, inStockOnly: false }} />
          </main>
        </div>
      </div>

      {/* Offers & Deals Section */}
      <OffersDeals />

      {/* Recently Viewed Section */}
      <RecentlyViewed />
    </>
  )
}

export default function ShopPage() {
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
        <ShopContent />
      </Suspense>
    </div>
  )
}
