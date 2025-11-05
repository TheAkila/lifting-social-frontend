'use client'

import { useState } from 'react'
import { FaFilter, FaTimes } from 'react-icons/fa'

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

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden btn-secondary w-full mb-6 flex items-center justify-center space-x-2"
      >
        <FaFilter />
        <span>Filters</span>
      </button>

      {/* Filters Panel */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } lg:block card sticky top-24`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold">Filters</h2>
          <button
            onClick={clearFilters}
            className="text-brand-accent text-sm hover:underline"
          >
            Clear All
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category}
                  onChange={() => setFilters({ ...filters, category })}
                  className="text-brand-accent focus:ring-brand-accent"
                />
                <span className="group-hover:text-brand-accent transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  filters.sizes.includes(size)
                    ? 'border-brand-accent bg-brand-accent text-brand-dark'
                    : 'border-brand-light/20 hover:border-brand-accent'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Price Range</h3>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label
                key={index}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={currentPriceRangeIndex === index}
                  onChange={() => setPriceRange(index)}
                  className="text-brand-accent focus:ring-brand-accent"
                />
                <span className="group-hover:text-brand-accent transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <h3 className="font-semibold mb-3">Availability</h3>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) =>
                setFilters({ ...filters, inStockOnly: e.target.checked })
              }
              className="text-brand-accent focus:ring-brand-accent"
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </div>
    </>
  )
}
