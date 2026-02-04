'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ShopHeader from '@/components/shop/ShopHeader'
import ShopCategoryNav from '@/components/shop/ShopCategoryNav'
import ProductGrid from '@/components/shop/ProductGrid'
import FeaturedProducts from '@/components/shop/FeaturedProducts'
import OffersDeals from '@/components/shop/OffersDeals'
import RecentlyViewed from '@/components/shop/RecentlyViewed'

const categories = [
  {
    name: 'Apparel',
    href: '/shop/apparel',
    description: 'Premium performance wear for men & women',
    subtitle: 'Performance Wear'
  },
  {
    name: 'Accessories',
    href: '/shop/accessories',
    description: 'Essential gear for every lift',
    subtitle: 'Essential Gear'
  },
  {
    name: 'Supplements',
    href: '/shop/supplements',
    description: 'Fuel your performance & recovery',
    subtitle: 'Fuel Performance'
  }
]

function ShopContent() {
  return (
    <>
      <ShopHeader />
      <ShopCategoryNav />
      
      {/* Featured Categories Section */}
      <div className="bg-zinc-50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-zinc-900 mb-3">
              Find Your Gear
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto">
              Explore our premium collection of weightlifting essentials
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((category, index) => {
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full"
                >
                  <Link href={category.href} className="block">
                    <div className="group relative bg-white rounded-[8px] p-4 sm:p-5 overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between border border-zinc-200 hover:border-zinc-300">
                      <div className="relative z-10">
                        {/* Content */}
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-zinc-900 mb-1">
                            {category.name}
                          </h3>
                          <p className="text-zinc-600 text-xs sm:text-sm">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="relative z-10 text-zinc-900 font-medium text-xs sm:text-sm mt-3">
                        <span className="inline-flex items-center gap-1">Shop Now →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Offers & Deals Section */}
      <OffersDeals />

      {/* Recently Viewed Section */}
      <RecentlyViewed />

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
