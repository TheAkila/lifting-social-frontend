'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'

const eventTypes = [
  { id: 'all', name: 'All Events' },
  { id: 'competition', name: 'Competitions' },
  { id: 'training', name: 'Training Camps' },
  { id: 'seminar', name: 'Seminars' },
  { id: 'meet', name: 'Meets' },
]

interface EventsFiltersProps {
  filter: string
  setFilter: (filter: string) => void
}

export default function EventsFilters({ filter, setFilter }: EventsFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const clearFilters = () => {
    setFilter('all')
  }

  const hasActiveFilters = filter !== 'all'

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

        {/* Event Type Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-zinc-700 mb-3">Event Type</h3>
          <div className="space-y-2">
            {eventTypes.map((type) => (
              <label
                key={type.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="eventType"
                  checked={filter === type.id}
                  onChange={() => setFilter(type.id)}
                  className="w-4 h-4 text-brand-accent border-zinc-300 focus:ring-brand-accent focus:ring-offset-0"
                />
                <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">
                  {type.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
