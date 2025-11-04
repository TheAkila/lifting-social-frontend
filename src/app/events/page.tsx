'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import api from '@/lib/api'
import { 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaTrophy, 
  FaUsers, 
  FaBullhorn,
  FaGraduationCap,
  FaDumbbell,
  FaClock,
  FaMoneyBill,
  FaUserPlus
} from 'react-icons/fa'

interface Event {
  _id: string
  title: string
  slug: string
  description: string
  eventType: 'meet' | 'competition' | 'training' | 'seminar' | 'news' | 'announcement'
  location?: string
  venue?: string
  startDate: string
  endDate?: string
  registrationDeadline?: string
  registrationLink?: string
  coverImage?: string
  organizer?: string
  contactEmail?: string
  contactPhone?: string
  isFeatured: boolean
  maxParticipants?: number
  currentParticipants?: number
  entryFee?: number
  categories?: string[]
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [filter, events])

  const loadEvents = async () => {
    try {
      const response = await api.get('/events')
      setEvents(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load events', err)
      setLoading(false)
    }
  }

  const filterEvents = () => {
    if (filter === 'all') {
      setFilteredEvents(events)
    } else if (filter === 'upcoming') {
      const now = new Date()
      setFilteredEvents(events.filter(e => new Date(e.startDate) >= now))
    } else {
      setFilteredEvents(events.filter(e => e.eventType === filter))
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'competition':
        return <FaTrophy className="text-brand-accent" />
      case 'meet':
        return <FaDumbbell className="text-brand-primary" />
      case 'training':
        return <FaUsers className="text-brand-secondary" />
      case 'seminar':
        return <FaGraduationCap className="text-purple-500" />
      case 'news':
        return <FaBullhorn className="text-blue-500" />
      case 'announcement':
        return <FaBullhorn className="text-green-500" />
      default:
        return <FaCalendar className="text-brand-light" />
    }
  }

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'competition':
        return 'bg-brand-accent/20 text-brand-accent'
      case 'meet':
        return 'bg-brand-primary/20 text-brand-primary'
      case 'training':
        return 'bg-brand-secondary/20 text-brand-secondary'
      case 'seminar':
        return 'bg-purple-500/20 text-purple-400'
      case 'news':
        return 'bg-blue-500/20 text-blue-400'
      case 'announcement':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-brand-light/20 text-brand-light'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date()
  }

  const isPastDeadline = (deadlineString?: string) => {
    if (!deadlineString) return false
    return new Date(deadlineString) < new Date()
  }

  return (
    <div className="min-h-screen pt-20 hero-bg">
      <div className="container-custom py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-display font-bold mb-4">
            Events & <span className="gradient-text">Meets</span>
          </h1>
          <p className="text-xl text-brand-light/70 max-w-2xl mx-auto">
            Stay updated with upcoming competitions, training camps, seminars, and weightlifting news
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {[
            { value: 'all', label: 'All Events' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'competition', label: 'Competitions' },
            { value: 'meet', label: 'Meets' },
            { value: 'training', label: 'Training' },
            { value: 'seminar', label: 'Seminars' },
            { value: 'news', label: 'News' },
            { value: 'announcement', label: 'Announcements' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === item.value
                  ? 'bg-brand-accent text-brand-dark'
                  : 'bg-brand-secondary/50 text-brand-light/70 hover:bg-brand-secondary/70'
              }`}
            >
              {item.label}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-brand-light/70">Loading events...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <FaCalendar className="text-6xl text-brand-light/30 mx-auto mb-4" />
            <p className="text-brand-light/70">No events found for this filter</p>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`card hover:scale-105 transition-all ${
                event.isFeatured ? 'ring-2 ring-brand-accent' : ''
              }`}
            >
              {/* Event Image */}
              {event.coverImage && (
                <div className="relative h-48 mb-4 -mt-6 -mx-6 rounded-t-lg overflow-hidden">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  {event.isFeatured && (
                    <div className="absolute top-4 right-4 bg-brand-accent text-brand-dark px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  )}
                </div>
              )}

              {/* Event Type Badge */}
              <div className="flex items-center gap-2 mb-3">
                {getEventIcon(event.eventType)}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getEventBadgeColor(event.eventType)}`}>
                  {event.eventType}
                </span>
                {isUpcoming(event.startDate) && (
                  <span className="ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                    UPCOMING
                  </span>
                )}
              </div>

              {/* Event Title */}
              <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>

              {/* Event Description */}
              <p className="text-brand-light/70 text-sm mb-4 line-clamp-3">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="space-y-2 text-sm mb-4">
                {/* Date */}
                <div className="flex items-center gap-2 text-brand-light/70">
                  <FaCalendar className="text-brand-accent" />
                  <span>
                    {formatDate(event.startDate)}
                    {event.endDate && event.endDate !== event.startDate && ` - ${formatDate(event.endDate)}`}
                  </span>
                </div>

                {/* Location */}
                {event.location && (
                  <div className="flex items-center gap-2 text-brand-light/70">
                    <FaMapMarkerAlt className="text-brand-primary" />
                    <span>{event.location}</span>
                  </div>
                )}

                {/* Participants */}
                {event.maxParticipants && (
                  <div className="flex items-center gap-2 text-brand-light/70">
                    <FaUsers className="text-brand-secondary" />
                    <span>
                      {event.currentParticipants || 0} / {event.maxParticipants} participants
                    </span>
                  </div>
                )}

                {/* Entry Fee */}
                {event.entryFee && (
                  <div className="flex items-center gap-2 text-brand-light/70">
                    <FaMoneyBill className="text-green-400" />
                    <span>Rs. {event.entryFee.toLocaleString()}</span>
                  </div>
                )}

                {/* Registration Deadline */}
                {event.registrationDeadline && (
                  <div className="flex items-center gap-2 text-brand-light/70">
                    <FaClock className={isPastDeadline(event.registrationDeadline) ? 'text-red-400' : 'text-brand-accent'} />
                    <span className={isPastDeadline(event.registrationDeadline) ? 'text-red-400' : ''}>
                      Register by {formatDate(event.registrationDeadline)}
                      {isPastDeadline(event.registrationDeadline) && ' (Closed)'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link
                  href={`/events/${event.slug}`}
                  className="btn-outline flex-1 text-center text-sm"
                >
                  Learn More
                </Link>
                {event.registrationLink && !isPastDeadline(event.registrationDeadline) && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex-1 text-center text-sm flex items-center justify-center gap-2"
                  >
                    <FaUserPlus />
                    Register
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
