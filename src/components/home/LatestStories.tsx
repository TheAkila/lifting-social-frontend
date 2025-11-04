'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowRight, FaClock } from 'react-icons/fa'
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
        setStories(res.data.slice(0, 3))
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

  return (
    <section className="section-padding bg-brand-secondary/20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Latest Stories</h2>
          <p className="section-subtitle">
            Inspiring tales from the Sri Lankan weightlifting community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-brand-light/70">Loading stories...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-brand-light/70">No stories available.</p>
            </div>
          ) : (
            stories.map((story, index) => (
              <motion.article
                key={story._id || story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card group cursor-pointer hover:scale-105 transition-transform"
              >
                <Link href={`/stories/${story.slug}`}>
                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-brand-primary to-brand-secondary">
                    {story.image ? (
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${story.image})` }} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/50 font-bold">
                          {story.category}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-brand-accent text-brand-dark text-xs font-bold rounded-full">
                        {story.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-bold mb-2 group-hover:text-brand-accent transition-colors">
                    {story.title}
                  </h3>

                  <p className="text-brand-light/70 text-sm mb-4 line-clamp-2">
                    {story.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-brand-light/50 mb-4">
                    <span>{story.author || 'Anonymous'}</span>
                    <div className="flex items-center space-x-1">
                      <FaClock className="text-xs" />
                      <span>{story.readTime || '5 min read'}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-brand-accent font-semibold group-hover:gap-2 transition-all">
                    Read More
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.article>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/stories" className="btn-secondary">
            View All Stories
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
