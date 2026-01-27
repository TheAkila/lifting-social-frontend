'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import api from '@/lib/api'

interface StoriesGridProps {
  selectedCategory: string
}

export default function StoriesGrid({ selectedCategory }: StoriesGridProps) {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const storiesPerPage = 12

  useEffect(() => {
    let mounted = true
    setLoading(true)
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

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  // Pagination
  const totalPages = Math.ceil(filteredStories.length / storiesPerPage)
  const startIndex = (currentPage - 1) * storiesPerPage
  const currentStories = filteredStories.slice(startIndex, startIndex + storiesPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
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

  const renderPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }

    return pages.map((page, index) => (
      typeof page === 'number' ? (
        <button
          key={index}
          onClick={() => goToPage(page)}
          className={`w-10 h-10 rounded-[8px] text-sm font-medium transition-all duration-200 ${
            currentPage === page
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          {page}
        </button>
      ) : (
        <span key={index} className="w-10 h-10 flex items-center justify-center text-zinc-400">
          {page}
        </span>
      )
    ))
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/3] bg-zinc-200 rounded-[12px] mb-4" />
            <div className="h-5 bg-zinc-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-zinc-200 rounded w-1/4" />
          </div>
        ))}
      </div>
    )
  }

  if (filteredStories.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 text-lg">
          No stories found in this category.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Stories Grid - Weightlifting House Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentStories.map((story, index) => (
          <motion.article
            key={story._id || story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-zinc-900 ml-1" fill="currentColor" />
                    </div>
                  </div>
                )}

                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-16 gap-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded-[8px] flex items-center justify-center transition-all duration-200 ${
              currentPage === 1
                ? 'text-zinc-300 cursor-not-allowed'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded-[8px] flex items-center justify-center transition-all duration-200 ${
              currentPage === totalPages
                ? 'text-zinc-300 cursor-not-allowed'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Results count */}
      <div className="text-center mt-6 text-sm text-zinc-500">
        Showing {startIndex + 1}–{Math.min(startIndex + storiesPerPage, filteredStories.length)} of {filteredStories.length} stories
      </div>
    </div>
  )
}
