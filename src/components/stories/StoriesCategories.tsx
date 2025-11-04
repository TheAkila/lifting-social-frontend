'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const categories = [
  { id: 'all', name: 'All Stories', count: 50 },
  { id: 'athlete-story', name: 'Athlete Stories', count: 20 },
  { id: 'training', name: 'Training Tips', count: 15 },
  { id: 'events', name: 'Events', count: 10 },
  { id: 'news', name: 'News', count: 5 },
]

export default function StoriesCategories() {
  const [activeCategory, setActiveCategory] = useState('all')

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(category.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeCategory === category.id
                ? 'bg-brand-accent text-brand-dark'
                : 'bg-brand-secondary/50 text-brand-light hover:bg-brand-secondary'
            }`}
          >
            {category.name}
            <span className="ml-2 text-sm opacity-70">({category.count})</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
