'use client'

import { motion } from 'framer-motion'

const categories = [
  { id: 'all', name: 'All Stories' },
  { id: 'athlete-story', name: 'Athlete Stories' },
  { id: 'training', name: 'Training Tips' },
  { id: 'events', name: 'Events' },
  { id: 'news', name: 'News' },
]

interface StoriesCategoriesProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export default function StoriesCategories({ 
  selectedCategory, 
  setSelectedCategory 
}: StoriesCategoriesProps) {
  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedCategory === category.id
                ? 'bg-brand-accent text-brand-dark'
                : 'bg-brand-secondary/50 text-brand-light hover:bg-brand-secondary'
            }`}
          >
            {category.name}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
