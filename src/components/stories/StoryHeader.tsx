'use client'

import { motion } from 'framer-motion'
import { FaClock, FaEye, FaCalendar, FaShare } from 'react-icons/fa'

interface StoryHeaderProps {
  story: {
    title: string
    excerpt: string
    category: string
    categoryColor: string
    author: {
      name: string
    }
    publishedAt: string
    readTime: string
    views: number
  }
}

export default function StoryHeader({ story }: StoryHeaderProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.excerpt,
        url: window.location.href,
      })
    }
  }

  return (
    <section className="hero-bg py-20 mt-20">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Category */}
          <span className={`inline-block px-4 py-2 ${story.categoryColor} text-white text-sm font-bold rounded-full mb-6`}>
            {story.category}
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {story.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-brand-light/80 mb-8">
            {story.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-brand-light/70">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">By {story.author.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendar />
              <span>{new Date(story.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock />
              <span>{story.readTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaEye />
              <span>{story.views.toLocaleString()} views</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-brand-accent hover:text-brand-accent/80 transition-colors"
            >
              <FaShare />
              <span>Share</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
