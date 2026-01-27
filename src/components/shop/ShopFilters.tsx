'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

const categories = ['All', 'Apparel', 'Accessories', 'Equipment', 'Merchandise']
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
    filters.inStockOnly

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full mb-6 flex items-center justify-center gap-2 bg-white border border-zinc-200 rounded-[10px] py-3 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="bg-brand-accent text-white text-xs px-2 py-0.5 rounded-full">
            Active
          </span>
        )}
      </button>

      {/* Filters Panel */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } lg:block bg-white rounded-[12px] border border-zinc-100 p-5 sticky top-20`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-display font-semibold text-zinc-900">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-brand-accent hover:text-rose-600 font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-zinc-700 mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category}
                  onChange={() => setFilters({ ...filters, category })}
                  className="w-4 h-4 text-brand-accent border-zinc-300 focus:ring-brand-accent focus:ring-offset-0"
                />
                <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-100 mb-6" />

        {/* Size Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-zinc-700 mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 rounded-[8px] text-sm font-medium transition-all ${
                  filters.sizes.includes(size)
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-100 mb-6" />

        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-zinc-700 mb-3">Price Range</h3>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label
                key={index}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={currentPriceRangeIndex === index}
                  onChange={() => setPriceRange(index)}
                  className="w-4 h-4 text-brand-accent border-zinc-300 focus:ring-brand-accent focus:ring-offset-0"
                />
                <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-100 mb-6" />

        {/* Availability Filter */}
        <div>
          <h3 className="text-sm font-medium text-zinc-700 mb-3">Availability</h3>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) =>
                setFilters({ ...filters, inStockOnly: e.target.checked })
              }
              className="w-4 h-4 text-brand-accent border-zinc-300 rounded focus:ring-brand-accent focus:ring-offset-0"
            />
            <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">
              In Stock Only
            </span>
          </label>
        </div>
      </div>
    </>
  )
}
