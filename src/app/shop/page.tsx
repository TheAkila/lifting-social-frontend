'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ShopHeader from '@/components/shop/ShopHeader'
import ShopCategoryNav from '@/components/shop/ShopCategoryNav'
import ProductGrid from '@/components/shop/ProductGrid'

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
                    <div className="group relative bg-zinc-900 rounded-[12px] p-6 sm:p-8 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer min-h-[240px] sm:min-h-[280px] flex flex-col justify-between border border-zinc-800">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-[0.03]">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
                        }} />
                      </div>

                      <div className="relative z-10">
                        {/* Badge */}
                        <div className="mb-4 sm:mb-6">
                          <div className="px-2.5 py-1 bg-zinc-800 rounded-full inline-block">
                            <span className="text-[10px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider">{category.subtitle}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mb-4 sm:mb-6">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white mb-2">
                            {category.name}
                          </h3>
                          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="relative z-10 text-white font-semibold text-sm sm:text-base">
                        <span>Shop Now</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

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
