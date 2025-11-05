'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowRight, FaClock, FaUser, FaYoutube } from 'react-icons/fa'
import { useState, useEffect, useMemo } from 'react'
import api from '@/lib/api'

interface StoriesGridProps {
  selectedCategory: string
}

export default function StoriesGrid({ selectedCategory }: StoriesGridProps) {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(10)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    // Add timestamp to prevent caching
    api
      .get(`/stories?t=${Date.now()}`)
      .then((res) => {
        if (!mounted) return
        setStories(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch stories', err)
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  // Filter stories by category
  const filteredStories = useMemo(() => {
    if (selectedCategory === 'all') {
      return stories
    }
    return stories.filter(
      (story) => story.category?.toLowerCase().replace(/\s+/g, '-') === selectedCategory
    )
  }, [stories, selectedCategory])

  // Reset display count when category changes
  useEffect(() => {
    setDisplayCount(10)
  }, [selectedCategory])

  const displayedStories = filteredStories.slice(0, displayCount)
  const hasMore = displayCount < filteredStories.length

  const loadMore = () => {
    setDisplayCount((prev) => prev + 9)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-light/70">Loading stories...</p>
      </div>
    )
  }

  if (filteredStories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-light/70">
          No stories found in this category.
        </p>
      </div>
    )
  }

  const featuredStory = displayedStories.find(s => s.featured)
  const regularStories = displayedStories.filter(s => !s.featured)

  return (
    <div className="space-y-12">
      {/* Featured Story */}
      {featuredStory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <FeaturedStory story={featuredStory} />
        </motion.div>
      )}

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {regularStories.map((story, index) => (
          <motion.article
            key={story._id || story.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card group cursor-pointer hover:scale-105 transition-transform"
          >
            <Link href={`/stories/${story.slug}`}>
              {/* Image */}
              <div className="relative h-56 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-brand-primary to-brand-secondary">
                {story.image ? (
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${story.image})` }} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {story.videoId ? (
                      <FaYoutube className="text-white/50 text-6xl" />
                    ) : (
                      <span className="text-white/50 font-bold text-lg">
                        {story.category}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 ${story.categoryColor} text-white text-xs font-bold rounded-full`}>
                    {story.category}
                  </span>
                </div>

                {/* Video Badge */}
                {story.videoId && (
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                      <FaYoutube className="text-white text-xl" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <h3 className="text-xl font-display font-bold mb-2 group-hover:text-brand-accent transition-colors line-clamp-2">
                {story.title}
              </h3>

              <p className="text-brand-light/70 text-sm mb-4 line-clamp-3">
                {story.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-brand-light/50 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <FaUser />
                    <span>{story.author || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaClock />
                    <span>{story.readTime || '5 min read'}</span>
                  </div>
                </div>
                <span>{(story.views || 0).toLocaleString()} views</span>
              </div>

              {/* Read More */}
              <div className="flex items-center text-brand-accent font-semibold group-hover:gap-2 transition-all">
                Read More
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12">
          <button onClick={loadMore} className="btn-secondary">
            Load More Stories
          </button>
        </div>
      )}

      {/* Showing count */}
      <div className="text-center text-brand-light/70 text-sm">
        Showing {displayedStories.length} of {filteredStories.length} stories
      </div>
    </div>
  )
}

function FeaturedStory({ story }: { story: any }) {
  return (
    <div className="card overflow-hidden">
      <Link href={`/stories/${story.slug}`}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative h-80 md:h-auto rounded-lg overflow-hidden bg-gradient-to-br from-brand-primary to-brand-secondary">
            {story.image ? (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${story.image})` }} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/50 font-bold text-2xl">
                  FEATURED
                </span>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 ${story.categoryColor} text-white text-sm font-bold rounded-full`}>
                {story.category}
              </span>
            </div>

            {/* Featured Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-yellow-500 text-brand-dark text-sm font-bold rounded-full">
                ⭐ FEATURED
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 hover:text-brand-accent transition-colors">
              {story.title}
            </h2>
            
            <p className="text-brand-light/80 text-lg mb-6">
              {story.excerpt}
            </p>

            <div className="flex items-center space-x-4 text-sm text-brand-light/60 mb-6">
              <div className="flex items-center space-x-2">
                <FaUser />
                <span>{story.author || 'Anonymous'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock />
                <span>{story.readTime || '5 min read'}</span>
              </div>
              <span>{(story.views || 0).toLocaleString()} views</span>
            </div>

            <div className="flex items-center text-brand-accent font-bold text-lg group hover:gap-3 transition-all">
              Read Full Story
              <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
