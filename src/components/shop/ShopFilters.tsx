'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

// Subcategories for refined filtering
const subcategories = {
  men: ['T-Shirts', 'Tanks', 'Hoodies', 'Shorts', 'Joggers', 'Compression'],
  women: ['Sports Bras', 'Leggings', 'Tops', 'Shorts', 'Hoodies', 'Sets'],
  accessories: ['Belts', 'Wraps', 'Straps', 'Bags', 'Knee Sleeves', 'Grips', 'Shakers/Bottles'],
  supplements: ['Protein', 'Pre-Workout', 'Creatine', 'Vitamins', 'Recovery', 'Energy']
}

const priceRanges = [
  { label: 'Under LKR 2,000', min: 0, max: 2000 },
  { label: 'LKR 2,000 - 5,000', min: 2000, max: 5000 },
  { label: 'LKR 5,000 - 10,000', min: 5000, max: 10000 },
  { label: 'Over LKR 10,000', min: 10000, max: Infinity },
]
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface ShopFiltersProps {
  filters: {
    category: string
    sizes: string[]
    priceRange: { min: number; max: number } | null
    inStockOnly: boolean
  }
  setFilters: (filters: any) => void
}

export default function ShopFilters({ filters, setFilters }: ShopFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  // Get subcategories based on current main category
  const currentSubcategories = filters.category && filters.category !== 'All' 
    ? subcategories[filters.category.toLowerCase() as keyof typeof subcategories] || []
    : []

  const toggleSize = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size]
    setFilters({ ...filters, sizes: newSizes })
  }

  const clearFilters = () => {
    setFilters({
      category: 'All',
      sizes: [],
      priceRange: null,
      inStockOnly: false,
    })
    setSelectedSubcategory(null)
  }

  const setPriceRange = (index: number | null) => {
    setFilters({
      ...filters,
      priceRange: index !== null ? priceRanges[index] : null,
    })
  }

  const currentPriceRangeIndex = filters.priceRange
    ? priceRanges.findIndex(
        (range) =>
          range.min === filters.priceRange!.min &&
          range.max === filters.priceRange!.max
      )
    : null

  const hasActiveFilters = 
    filters.category !== 'All' || 
    filters.sizes.length > 0 || 
    filters.priceRange !== null || 
    filters.inStockOnly ||
    selectedSubcategory !== null

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full mb-6 flex items-center justify-center gap-2 bg-white border-2 border-zinc-900 rounded-lg py-3 px-4 text-sm font-bold text-zinc-900 hover:bg-zinc-50 transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full font-semibold">
            {(filters.sizes.length || 0) + (filters.priceRange ? 1 : 0) + (selectedSubcategory ? 1 : 0) + (filters.inStockOnly ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Filters Panel */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } lg:block bg-white rounded-xl border-2 border-zinc-900 p-6 sticky top-[180px] shadow-[6px_6px_0_0_rgba(0,0,0,1)]`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-bold text-zinc-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Refine Search
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-red-600 hover:text-red-700 font-bold transition-colors uppercase tracking-wide"
            >
              Reset
            </button>
          )}
        </div>

        {/* Subcategory Filter - Only show if a main category is selected */}
        {currentSubcategories.length > 0 && (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-bold text-zinc-900 mb-3 uppercase tracking-wide">Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {currentSubcategories.map((subcat) => (
                  <button
                    key={subcat}
                    onClick={() => setSelectedSubcategory(selectedSubcategory === subcat ? null : subcat)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border-2 ${
                      selectedSubcategory === subcat
                        ? 'bg-black text-white border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.3)]'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-900 hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]'
                    }`}
                  >
                    {subcat}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-900 mb-6 opacity-20" />
          </>
        )}

        {/* Size Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-zinc-900 mb-3 uppercase tracking-wide">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`w-12 h-12 rounded-lg text-sm font-bold transition-all border-2 ${
                  filters.sizes.includes(size)
                    ? 'bg-black text-white border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.3)]'
                    : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-900 hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-900 mb-6 opacity-20" />

        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-zinc-900 mb-3 uppercase tracking-wide">Price</h3>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label
                key={index}
                className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  currentPriceRangeIndex === index 
                    ? 'border-black bg-black' 
                    : 'border-zinc-300 group-hover:border-zinc-900'
                }`}>
                  {currentPriceRangeIndex === index && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <input
                  type="radio"
                  name="priceRange"
                  checked={currentPriceRangeIndex === index}
                  onChange={() => setPriceRange(index)}
                  className="sr-only"
                />
                <span className="text-sm text-zinc-700 group-hover:text-zinc-900 font-medium transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-900 mb-6 opacity-20" />

        {/* Availability Filter */}
        <div>
          <h3 className="text-sm font-bold text-zinc-900 mb-3 uppercase tracking-wide">Stock</h3>
          <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-zinc-50 transition-colors">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              filters.inStockOnly 
                ? 'border-black bg-black' 
                : 'border-zinc-300 group-hover:border-zinc-900'
            }`}>
              {filters.inStockOnly && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) =>
                setFilters({ ...filters, inStockOnly: e.target.checked })
              }
              className="sr-only"
            />
            <span className="text-sm text-zinc-700 group-hover:text-zinc-900 font-medium transition-colors">
              In Stock Only
            </span>
          </label>
        </div>
      </div>
    </>
  )
}
