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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-zinc-900">
              Weightlifting News
            </h2>
            <p className="text-zinc-500 mt-2">
              Stories, interviews, and updates from the weightlifting world
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
              className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors group"
            >
              <span>View All Stories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-zinc-200 rounded-[12px] mb-4" />
                <div className="h-5 bg-zinc-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-zinc-200 rounded w-1/4" />
              </div>
            ))
          ) : stories.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-zinc-500">No stories available at the moment.</p>
            </div>
          ) : (
            stories.map((story, index) => (
              <motion.article
                key={story._id || story.id}
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
                        <span className="text-white/40 font-display font-bold text-lg text-center px-4">
                          {story.title}
                        </span>
                      </div>
                    )}
                    
                    {/* Video indicator */}
                    {story.videoId && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-zinc-900 ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-semibold text-zinc-900 leading-snug line-clamp-2 group-hover:text-brand-accent transition-colors">
                      {story.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <time className="text-sm text-zinc-500">
                        {formatDate(story.createdAt || story.publishDate)}
                      </time>
                      
                      <span className="text-sm font-medium text-zinc-900 uppercase tracking-wider group-hover:text-brand-accent transition-colors">
                        Read More
                      </span>
                    </div>
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
