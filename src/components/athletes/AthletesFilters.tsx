'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaFilter } from 'react-icons/fa'

const categories = ['All', '55kg', '61kg', '67kg', '73kg', '81kg', '89kg', '96kg', '+96kg']
const genders = ['All', 'Male', 'Female']

export default function AthletesFilters() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedGender, setSelectedGender] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="mb-12 space-y-6">
      {/* Search */}
      <div className="max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search athletes by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
              onClick={() => setSelectedGender(gender)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedGender === gender
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
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === category
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
