'use client'

import { motion } from 'framer-motion'
import { FaFilter } from 'react-icons/fa'

const categories = ['All', '55kg', '61kg', '67kg', '73kg', '81kg', '89kg', '96kg', '+96kg']
const genders = ['All', 'Male', 'Female']

interface AthletesFiltersProps {
  filters: {
    category: string
    gender: string
    searchQuery: string
  }
  setFilters: (filters: any) => void
}

export default function AthletesFilters({ filters, setFilters }: AthletesFiltersProps) {
  return (
    <div className="mb-12 space-y-6">
      {/* Search */}
      <div className="max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search athletes by name..."
          value={filters.searchQuery}
          onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
          className="input-field w-full"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <div className="flex items-center space-x-2">
          <FaFilter className="text-brand-accent" />
          <span className="font-semibold">Filter by:</span>
        </div>

        {/* Gender Filter */}
        <div className="flex gap-2">
          {genders.map((gender) => (
            <button
              key={gender}
              onClick={() => setFilters({ ...filters, gender })}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filters.gender === gender
                  ? 'bg-brand-accent text-brand-dark'
                  : 'bg-brand-secondary/50 text-brand-light hover:bg-brand-secondary'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilters({ ...filters, category })}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filters.category === category
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-secondary/50 text-brand-light hover:bg-brand-secondary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
