'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play, ExternalLink, Clock } from 'lucide-react'
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
      (story) => story.category?.toLowerCase() === selectedCategory.toLowerCase()
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
            </svg>
          </div>
          <p className="text-zinc-900 text-lg font-semibold mb-2">
            {selectedCategory === 'all' ? 'No articles yet' : 'No articles in this category'}
          </p>
         
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Stories Grid - Weightlifting House Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                {/* External source badge */}
                {story.is_external && story.source_name && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <ExternalLink className="w-3 h-3" />
                    <span>from {story.source_name}</span>
                  </div>
                )}
                
                <h3 className="font-display text-lg font-semibold text-zinc-900 leading-snug line-clamp-2 group-hover:text-zinc-600 transition-colors">
                  {story.title}
                </h3>
                
                {/* Excerpt for external posts */}
                {story.is_external && story.excerpt && (
                  <p className="text-sm text-zinc-600 line-clamp-2">
                    {story.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <time>
                      {formatDate(story.published_at || story.createdAt || story.publishDate)}
                    </time>
                    {story.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {story.readTime}
                      </span>
                    )}
                  </div>
                  
                  <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider group-hover:text-zinc-600 transition-colors">
                    {story.is_external ? 'Read More →' : 'Read More'}
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
