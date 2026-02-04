'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

const categories = [
  { 
    name: 'Apparel', 
    value: 'apparel',
    href: '/shop/apparel',
    description: 'Performance apparel for men & women'
  },
]

const accessoriesCategories = [
  { name: 'All Accessories', slug: 'accessories' },
  { name: 'Belts', slug: 'belts' },
  { name: 'Wraps', slug: 'wraps' },
  { name: 'Straps', slug: 'straps' },
  { name: 'Knee Sleeves', slug: 'knee-sleeves' },
  { name: 'Grips', slug: 'grips' },
  { name: 'Bags', slug: 'bags' },
]

const supplementCategories = [
  { name: 'All Supplements', slug: 'supplements' },
  { name: 'Protein', slug: 'protein' },
  { name: 'Pre-Workout', slug: 'pre-workout' },
  { name: 'Creatine', slug: 'creatine' },
  { name: 'Vitamins', slug: 'vitamins' },
  { name: 'Recovery', slug: 'recovery' },
  { name: 'Energy', slug: 'energy' },
]

export default function ShopCategoryNav() {
  const pathname = usePathname()
  const [supplementsOpen, setSupplementsOpen] = useState(false)
  const [accessoriesOpen, setAccessoriesOpen] = useState(false)
  const [supplementsRef, setSupplementsRef] = useState<HTMLButtonElement | null>(null)
  const [accessoriesRef, setAccessoriesRef] = useState<HTMLButtonElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSupplementsOpen(false)
        setAccessoriesOpen(false)
      }
    }

    if (supplementsOpen || accessoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [supplementsOpen, accessoriesOpen])
  
  const isActive = (href: string) => {
    return pathname === href
  }
  
  const isShopHome = pathname === '/shop'
  const isSupplementsActive = pathname.includes('/shop/supplements')
  const isAccessoriesActive = pathname.includes('/shop/accessories')

  return (
    <nav className="bg-white border-t border-b border-zinc-200 sticky top-[72px] z-40">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div ref={containerRef} className="flex items-center justify-center py-2 sm:py-3 gap-0.5 sm:gap-1 overflow-x-auto">
          {/* All Products Link */}
          <Link 
            href="/shop"
            className={`px-1.5 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 rounded-[6px] text-xs sm:text-sm md:text-base font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
              isShopHome
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            All Products
          </Link>

          {/* Category Links */}
          {categories.map((category) => {
            const active = isActive(category.href)

            return (
              <Link
                key={category.value}
                href={category.href}
                className={`group relative px-1.5 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 rounded-[6px] text-xs sm:text-sm md:text-base font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                  active
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <span>{category.name}</span>
                
                {/* Active Indicator */}
                {active && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-zinc-900 rounded-[8px] -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}

          {/* Supplements Dropdown */}
          <button
            ref={setSupplementsRef}
            onClick={() => {
              setSupplementsOpen(!supplementsOpen)
              setAccessoriesOpen(false)
            }}
            className={`group relative px-1.5 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 rounded-[6px] text-xs sm:text-sm md:text-base font-semibold transition-all whitespace-nowrap flex items-center gap-0.5 sm:gap-1 flex-shrink-0 ${
              isSupplementsActive
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <span>Supplements</span>
            <motion.div
              animate={{ rotate: supplementsOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-3 h-3 sm:w-4 sm:h-4"
            >
              <ChevronDown size={12} className="sm:block hidden" />
              <ChevronDown size={10} className="block sm:hidden" />
            </motion.div>
            
            {/* Active Indicator */}
            {isSupplementsActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-zinc-900 rounded-[8px] -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          {/* Accessories Dropdown */}
          <button
            ref={setAccessoriesRef}
            onClick={() => {
              setAccessoriesOpen(!accessoriesOpen)
              setSupplementsOpen(false)
            }}
            className={`group relative px-1.5 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 rounded-[6px] text-xs sm:text-sm md:text-base font-semibold transition-all whitespace-nowrap flex items-center gap-0.5 sm:gap-1 flex-shrink-0 ${
              isAccessoriesActive
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <span>Accessories</span>
            <motion.div
              animate={{ rotate: accessoriesOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-3 h-3 sm:w-4 sm:h-4"
            >
              <ChevronDown size={12} className="sm:block hidden" />
              <ChevronDown size={10} className="block sm:hidden" />
            </motion.div>
            
            {/* Active Indicator */}
            {isAccessoriesActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-zinc-900 rounded-[8px] -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Supplements Dropdown Menu - Outside scroll container */}
      {supplementsOpen && supplementsRef && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            top: supplementsRef.getBoundingClientRect().bottom + window.scrollY - 2,
            left: supplementsRef.getBoundingClientRect().left,
          }}
          className="bg-white border border-zinc-200 rounded-[8px] shadow-lg py-2 min-w-[180px] z-[9999]"
        >
          {supplementCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/supplements${cat.slug === 'supplements' ? '' : `/${cat.slug}`}`}
              onClick={() => setSupplementsOpen(false)}
              className="block px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </motion.div>
      )}

      {/* Accessories Dropdown Menu - Outside scroll container */}
      {accessoriesOpen && accessoriesRef && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            top: accessoriesRef.getBoundingClientRect().bottom + window.scrollY - 2,
            left: accessoriesRef.getBoundingClientRect().left,
          }}
          className="bg-white border border-zinc-200 rounded-[8px] shadow-lg py-2 min-w-[180px] z-[9999]"
        >
          {accessoriesCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/accessories${cat.slug === 'accessories' ? '' : `/${cat.slug}`}`}
              onClick={() => setAccessoriesOpen(false)}
              className="block px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  )
}
