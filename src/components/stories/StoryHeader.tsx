'use client'

import { motion } from 'framer-motion'
import { Clock, Eye, Calendar, Share2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface StoryHeaderProps {
  story: {
    title: string
    excerpt: string
    category: string
    categoryColor?: string
    coverImage?: string
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
    } else {
      navigator.clipboard.writeText(window.location.href)
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

  return (
    <section className="bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Stories</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Category */}
            <span className="inline-block bg-white text-zinc-900 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
              {story.category}
            </span>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {story.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
              {story.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
              <span className="text-white font-medium">
                By {story.author.name}
              </span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(story.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{story.readTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{story.views?.toLocaleString() || 0} views</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors ml-auto"
                aria-label="Share story"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cover Image */}
      {story.coverImage && (
        <div className="relative h-[50vh] min-h-[400px]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${story.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
      )}
    </section>
  )
}
