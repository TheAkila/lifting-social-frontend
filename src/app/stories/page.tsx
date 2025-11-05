'use client'

import { useState } from 'react'
import StoriesHeader from '@/components/stories/StoriesHeader'
import StoriesGrid from '@/components/stories/StoriesGrid'
import StoriesCategories from '@/components/stories/StoriesCategories'

export default function StoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  return (
    <div className="min-h-screen pt-20">
      <StoriesHeader />
      <div className="container-custom section-padding">
        <StoriesCategories 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <StoriesGrid selectedCategory={selectedCategory} />
      </div>
    </div>
  )
}
