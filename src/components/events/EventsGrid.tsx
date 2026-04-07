'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Users, Trophy, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Event {
  id: string
  title: string
  slug: string
  description: string
  event_type: 'meet' | 'competition' | 'training' | 'seminar' | 'news' | 'announcement'
  location?: string
  venue?: string
  start_date: string
  end_date?: string
  cover_image?: string
  organizer?: string
  max_participants?: number
  current_participants?: number
  entry_fee?: number
  competition_status?: string
  event_status?: string
  status?: string
  has_ongoing_sessions?: boolean
}

interface EventsGridProps {
  events: Event[]
}

export default function EventsGrid({ events }: EventsGridProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 9

  // Calculate pagination
  const totalPages = Math.ceil(events.length / eventsPerPage)
  const startIndex = (currentPage - 1) * eventsPerPage
  const endIndex = startIndex + eventsPerPage
  const currentEvents = events.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [events])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`w-10 h-10 rounded-[8px] text-sm font-medium transition-all duration-200 ${
            currentPage === i
              ? 'bg-zinc-900 text-white'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          {i}
        </button>
      )
    }

    return pages
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getEventTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      competition: 'Competition',
      training: 'Training Camp',
      seminar: 'Seminar',
      meet: 'Meet',
      news: 'News',
      announcement: 'Announcement'
    }
    return labels[type] || type
  }

  const isLiveEvent = (event: Event) => {
    return event.has_ongoing_sessions === true
  }

  if (events.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <p className="text-zinc-500">
          No events found matching your filters. Try adjusting your selection.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {currentEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link
              href={`/events/${event.slug}`}
              className="group block bg-white rounded-lg overflow-hidden border border-zinc-200 shadow-md transition-all duration-300"
            >
              {/* Image */}
              <div className="relative w-full overflow-hidden bg-zinc-100 aspect-[16/9]">
                {event.cover_image ? (
                  <Image
                    src={event.cover_image}
                    alt={event.title}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-200">
                    <Trophy className="w-16 h-16 text-zinc-400" />
                  </div>
                )}
                {/* Event Type Badge */}
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {getEventTypeLabel(event.event_type)}
                </div>
                {isLiveEvent(event) && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white/90 animate-pulse" />
                    LIVE
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-zinc-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {event.title}
                </h3>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-zinc-600 mb-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {formatDate(event.start_date)}
                    {event.end_date && ` - ${formatDate(event.end_date)}`}
                  </span>
                </div>

                {/* Location */}
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-zinc-600 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}

                {/* Participants */}
                {event.max_participants && (
                  <div className="flex items-center gap-2 text-sm text-zinc-600 mb-4 pb-4 border-b border-zinc-100">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {event.current_participants || 0} / {event.max_participants} participants
                    </span>
                  </div>
                )}

                {/* Description Preview */}
                {event.description && (
                  <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                )}

                {/* View Details Link */}
                <div className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700 inline-flex items-center gap-3">
                  <span>View Details →</span>
                  {isLiveEvent(event) && (
                    <span
                      role="button"
                      tabIndex={0}
                      className="text-red-600 font-semibold cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        router.push(`/events/${event.slug}/live`)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          e.stopPropagation()
                          router.push(`/events/${event.slug}/live`)
                        }
                      }}
                    >
                      Watch Live →
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-[8px] border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-[8px] border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
