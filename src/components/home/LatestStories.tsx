'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '@/lib/api'

export default function LatestStories() {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get('/stories')
      .then((res) => {
        if (!mounted) return
        setStories(res.data.slice(0, 6))
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

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 sm:gap-6 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-black mb-4">
              Community Stories
            </h2>
            <p className="text-gray-600 text-lg max-w-lg">
              Inspiring journeys from weightlifters in our community
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 text-black hover:text-gray-600 text-base font-semibold transition-colors group whitespace-nowrap"
            >
              <span>View All Stories</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))
          ) : stories.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500">No stories available at the moment.</p>
            </div>
          ) : (
            stories.map((story, index) => (
              <motion.article
                key={story._id || story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/stories/${story.slug}`} className="block">
                  {/* Image Container */}
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-5 bg-black">
                    {story.image ? (
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                        style={{ backgroundImage: `url(${story.image})` }} 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black flex items-center justify-center">
                        <span className="text-white/30 font-display font-bold text-lg text-center px-4">
                          {story.title}
                        </span>
                      </div>
                    )}
                    
                    {/* Video indicator */}
                    {story.videoId && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg"
                        >
                          <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
                        </motion.div>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-display text-xl font-bold text-black leading-snug line-clamp-2 mb-3 group-hover:text-gray-600 transition-colors">
                      {story.title}
                    </h3>
                    
                    <time className="text-sm text-gray-500">
                      {formatDate(story.createdAt || story.publishDate)}
                    </time>
                  </div>
                </Link>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
