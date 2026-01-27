'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/api'
import { Calendar, MapPin, Users, DollarSign, Clock, Mail, Phone, ArrowLeft, Trophy } from 'lucide-react'

interface Event {
  id: string
  title: string
  slug: string
  description: string
  event_type: string
  location?: string
  venue?: string
  start_date: string
  end_date?: string
  cover_image?: string
  organizer?: string
  max_participants?: number
  current_participants?: number
  entry_fee?: number
}

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      loadEvent()
    }
  }, [params.slug])

  const loadEvent = async () => {
    try {
      const response = await api.get(`/events/${params.slug}`)
      setEvent(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load event', err)
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
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

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <p className="text-zinc-400">Loading event...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 mb-4">Event Not Found</h1>
          <Link href="/events" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/events" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cover Image */}
            {event.cover_image && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-full rounded-[12px] overflow-hidden mb-8 bg-zinc-100"
                style={{ paddingBottom: '56.25%' }}
              >
                <Image
                  src={event.cover_image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </motion.div>
            )}

            {/* Event Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 mb-4">
                {getEventTypeLabel(event.event_type)}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">{event.title}</h1>
              <p className="text-xl text-zinc-600 leading-relaxed">{event.description}</p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Quick Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-zinc-200 rounded-[12px] p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-zinc-900 mb-6">Event Details</h3>
                <div className="space-y-5">
                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-zinc-900 text-sm mb-1">Date</div>
                      <div className="text-sm text-zinc-600">
                        {formatDate(event.start_date)}
                        {event.end_date && event.end_date !== event.start_date && (
                          <> to {formatDate(event.end_date)}</>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-zinc-900 text-sm mb-1">Location</div>
                        <div className="text-sm text-zinc-600">{event.location}</div>
                        {event.venue && (
                          <div className="text-sm text-zinc-500">{event.venue}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Participants */}
                  {event.max_participants && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-zinc-900 text-sm mb-1">Participants</div>
                        <div className="text-sm text-zinc-600">
                          {event.current_participants || 0} / {event.max_participants} registered
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Entry Fee */}
                  {event.entry_fee && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-zinc-900 text-sm mb-1">Entry Fee</div>
                        <div className="text-sm text-zinc-600">
                          Rs. {event.entry_fee.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Organizer */}
                  {event.organizer && (
                    <div className="flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-zinc-900 text-sm mb-1">Organizer</div>
                        <div className="text-sm text-zinc-600">{event.organizer}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Register Button */}
                <div className="mt-6">
                  <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Register for Event
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
