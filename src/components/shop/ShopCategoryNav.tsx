'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'


const categories = [
  { 
    name: 'Men', 
    value: 'men', 
    
    description: 'Performance apparel & gear'
  },
  { 
    name: 'Women', 
    value: 'women', 
   
    description: 'Strength meets style'
  },
  { 
    name: 'Accessories', 
    value: 'accessories', 
    
    description: 'Belts, wraps & straps'
  },
  { 
    name: 'Supplements', 
    value: 'supplements', 
  
    description: 'Fuel your performance'
  },
]

export default function ShopCategoryNav() {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'all'

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-[72px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 overflow-x-auto scrollbar-hide">
          {/* All Products Link */}
          <Link 
            href="/shop"
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              currentCategory === 'all'
                ? 'bg-black text-white'
                : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
            }`}
          >
            All Products
          </Link>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-zinc-200 mx-2" />

          {/* Category Links */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const isActive = currentCategory === category.value

              return (
                <Link
                  key={category.value}
                  href={`/shop?category=${category.value}`}
                  className={`group relative flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
                  }`}
                >
                  <span>{category.name}</span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-black rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Category Description (Optional - shown on desktop) */}
        {currentCategory !== 'all' && (
          <div className="hidden md:block pb-3">
            <p className="text-xs text-zinc-500">
              {categories.find(cat => cat.value === currentCategory)?.description}
            </p>
          </div>
        )}
      </div>
    </nav>
  )
}
