'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface Story {
  _id: string
  slug: string
  title: string
  excerpt: string
  category: string
  image?: string
  videoId?: string
  createdAt?: string
  publishDate?: string
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

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <section className="mt-20 pt-12 border-t border-zinc-200">
        <h2 className="font-display text-2xl font-bold text-zinc-900 mb-8">More Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-zinc-200 rounded-[12px] mb-4" />
              <div className="h-5 bg-zinc-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-zinc-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (relatedStories.length === 0) {
    return null
  }

  return (
    <section className="mt-20 pt-12 border-t border-zinc-200">
      <h2 className="font-display text-2xl font-bold text-zinc-900 mb-8">More Stories</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedStories.map((story, index) => (
          <motion.article
            key={story._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group"
          >
            <Link href={`/stories/${story.slug}`} className="block">
              {/* Image Container */}
              <div className="relative aspect-[4/3] rounded-[12px] overflow-hidden mb-4 bg-zinc-100">
                {story.image ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                    style={{ backgroundImage: `url(${story.image})` }} 
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                    <span className="text-white/40 font-display font-bold text-sm text-center px-4">
                      {story.title}
                    </span>
                  </div>
                )}
                
                {/* Video indicator */}
                {story.videoId && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 text-zinc-900 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="font-display text-base font-semibold text-zinc-900 leading-snug line-clamp-2 group-hover:text-brand-accent transition-colors">
                  {story.title}
                </h3>
                
                <div className="flex items-center justify-between">
                  <time className="text-sm text-zinc-500">
                    {formatDate(story.createdAt || story.publishDate || '')}
                  </time>
                  
                  <span className="text-xs font-medium text-zinc-900 uppercase tracking-wider group-hover:text-brand-accent transition-colors">
                    Read More
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
