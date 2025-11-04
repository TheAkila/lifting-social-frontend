'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface Story {
  _id: string
  slug: string
  title: string
  excerpt: string
  category: string
  categoryColor?: string
  readTime?: string
}

export default function RelatedStories({ currentStoryId }: { currentStoryId: string }) {
  const [relatedStories, setRelatedStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRelatedStories()
  }, [currentStoryId])

  const loadRelatedStories = async () => {
    try {
      const response = await api.get('/stories')
      // Filter out current story and get up to 3 related stories
      const filtered = response.data
        .filter((story: Story) => story._id !== currentStoryId)
        .slice(0, 3)
      setRelatedStories(filtered)
    } catch (error) {
      console.error('Error fetching related stories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="mt-20">
        <h2 className="text-3xl font-display font-bold mb-8">Related Stories</h2>
        <div className="text-center py-8">
          <p className="text-brand-light/70">Loading related stories...</p>
        </div>
      </section>
    )
  }

  if (relatedStories.length === 0) {
    return null
  }
  return (
    <section className="mt-20">
      <h2 className="text-3xl font-display font-bold mb-8">Related Stories</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedStories.map((story, index) => (
          <motion.article
            key={story._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card group cursor-pointer hover:scale-105 transition-transform"
          >
            <Link href={`/stories/${story.slug}`}>
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-brand-primary to-brand-secondary">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/50 font-bold">{story.category}</span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 ${story.categoryColor} text-white text-xs font-bold rounded-full`}>
                    {story.category}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-display font-bold mb-2 group-hover:text-brand-accent transition-colors">
                {story.title}
              </h3>
              
              <p className="text-brand-light/70 text-sm mb-4">
                {story.excerpt}
              </p>
              
              <div className="flex items-center text-brand-accent font-semibold group-hover:gap-2 transition-all">
                Read More
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
