'use client'

import { useState } from 'react'
import StoriesHeader from '@/components/stories/StoriesHeader'
import StoriesGrid from '@/components/stories/StoriesGrid'
import StoriesCategories from '@/components/stories/StoriesCategories'

export default function StoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  return (
    <div className="min-h-screen pt-20 bg-white">
      <StoriesHeader />
      <div className="container mx-auto px-4 py-12">
        <StoriesCategories 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <StoriesGrid selectedCategory={selectedCategory} />
      </div>
    </div>
  )
}
