'use client'

import { motion } from 'framer-motion'

const categories = [
  { id: 'all', name: 'All Articles' },
  { id: 'weightlifting', name: 'Weightlifting' },
  { id: 'training', name: 'Training' },
  { id: 'strength', name: 'Strength' },
  { id: 'nutrition', name: 'Nutrition' },
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
    <div className="mb-10">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
