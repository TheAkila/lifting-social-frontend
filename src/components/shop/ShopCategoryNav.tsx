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
      const target = event.target as Node
      // Check if click is outside the nav container and not on the dropdown itself
      if (containerRef.current && !containerRef.current.contains(target)) {
        // Don't close if clicking on a link inside the dropdown
        const isClickInDropdown = (target as HTMLElement).closest('[data-dropdown="supplements"]') || 
                                  (target as HTMLElement).closest('[data-dropdown="accessories"]')
        if (!isClickInDropdown) {
          setSupplementsOpen(false)
          setAccessoriesOpen(false)
        }
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
    <nav className="bg-white border-b border-zinc-100 sticky top-[88px] sm:top-[96px] z-30">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div ref={containerRef} className="flex items-center justify-center py-2 sm:py-3 gap-0.5 sm:gap-1 md:gap-2 overflow-x-auto sm:overflow-visible">
          {/* All Products Link */}
          <Link 
            href="/shop"
            className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all whitespace-nowrap ${
              isShopHome
                ? 'text-zinc-900 bg-black/10'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-black/5'
            }`}
          >
            All
          </Link>

          {/* Category Links */}
          {categories.map((category) => {
            const active = isActive(category.href)

            return (
              <Link
                key={category.value}
                href={category.href}
                className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                  active
                    ? 'text-zinc-900 bg-black/10'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-black/5'
                }`}
              >
                {category.name}
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
            className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all whitespace-nowrap flex items-center gap-0.5 sm:gap-1 ${
              isSupplementsActive
                ? 'text-zinc-900 bg-black/10'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-black/5'
            }`}
          >
            <span>Supplements</span>
            <motion.div
              animate={{ rotate: supplementsOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-4 h-4"
            >
              <ChevronDown size={14} />
            </motion.div>
          </button>

          {/* Accessories Dropdown */}
          <button
            ref={setAccessoriesRef}
            onClick={() => {
              setAccessoriesOpen(!accessoriesOpen)
              setSupplementsOpen(false)
            }}
            className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all whitespace-nowrap flex items-center gap-0.5 sm:gap-1 ${
              isAccessoriesActive
                ? 'text-zinc-900 bg-black/10'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-black/5'
            }`}
          >
            <span>Accessories</span>
            <motion.div
              animate={{ rotate: accessoriesOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-4 h-4"
            >
              <ChevronDown size={14} />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Supplements Dropdown Menu - Fixed position, stays on screen */}
      {supplementsOpen && supplementsRef && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          data-dropdown="supplements"
          style={{
            position: 'fixed',
            top: supplementsRef.getBoundingClientRect().bottom - 2,
            left: supplementsRef.getBoundingClientRect().left,
          }}
          className="bg-white border border-zinc-200 rounded-[8px] shadow-lg py-2 min-w-[180px] z-40"
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

      {/* Accessories Dropdown Menu - Fixed position, stays on screen */}
      {accessoriesOpen && accessoriesRef && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          data-dropdown="accessories"
          style={{
            position: 'fixed',
            top: accessoriesRef.getBoundingClientRect().bottom - 2,
            left: accessoriesRef.getBoundingClientRect().left,
          }}
          className="bg-white border border-zinc-200 rounded-[8px] shadow-lg py-2 min-w-[180px] z-40"
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
