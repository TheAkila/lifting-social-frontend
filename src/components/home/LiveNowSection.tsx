'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Trophy, ArrowRight } from 'lucide-react'
import api from '@/lib/api'

interface EventItem {
  id: string
  title?: string
  name?: string
  slug?: string
  location?: string
  venue?: string
  start_date?: string
  date?: string
  competition_status?: string
  event_status?: string
  status?: string
  cover_image?: string
}

const LIVE_STATUSES = ['in_progress', 'live', 'active', 'ongoing']

const STATUS_LABELS: Record<string, string> = {
  in_progress: 'In Progress',
  live: 'Live',
  active: 'Live',
  ongoing: 'Ongoing',
}

function getStatus(event: EventItem) {
  return (event.competition_status || event.event_status || event.status || '').toLowerCase()
}

function getStatusLabel(event: EventItem) {
  return STATUS_LABELS[getStatus(event)] || 'Live'
}

function getDate(event: EventItem) {
  return event.start_date || event.date || ''
}

function getTitle(event: EventItem) {
  return event.title || event.name || 'Untitled Event'
}

function getEventPath(event: EventItem, preferLive: boolean) {
  const identifier = event.slug || event.id
  return preferLive ? `/events/${identifier}/live` : `/events/${identifier}`
}

function formatEventDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function EventThumbnail({ event, className }: { event: EventItem; className?: string }) {
  if (!event.cover_image) {
    return (
      <div className={`bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center ${className}`}>
        <Trophy className="w-1/3 h-1/3 text-zinc-600" />
      </div>
    )
  }

  return (
    <Image
      src={event.cover_image}
      alt={getTitle(event)}
      fill
      className={`object-cover ${className}`}
      sizes="(min-width: 768px) 50vw, 100vw"
    />
  )
}

export default function LiveNowSection() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const liveResponse = await api.get('/wl-system/live/events', {
          headers: { 'X-Suppress-Global-Error': '1' }
        })
        const items = Array.isArray(liveResponse.data?.live_now) ? liveResponse.data.live_now : []

        if (isMounted) setEvents(items)
      } catch {
        if (isMounted) setEvents([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    const intervalId = setInterval(load, 30000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  const liveEvents = useMemo(
    () => events.filter((event) => LIVE_STATUSES.includes(getStatus(event))),
    [events]
  )

  if (loading || liveEvents.length === 0) {
    return null
  }

  const [featuredEvent, ...otherLiveEvents] = liveEvents
  const formattedDate = getDate(featuredEvent) ? formatEventDate(getDate(featuredEvent)) : null
  const place = featuredEvent.location || featuredEvent.venue

  return (
    <section className="bg-zinc-50 py-10 sm:py-14 md:py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center mb-6 sm:mb-10"
      >
        <div className="inline-flex items-center gap-2 text-red-600 text-xs font-semibold uppercase tracking-widest mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
          </span>
          Live Now
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900">
          Live Right Now
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl border border-zinc-100 shadow-soft hover:shadow-card-hover transition-shadow duration-350 p-4 sm:p-8"
      >
        <Link href={getEventPath(featuredEvent, true)} className="group grid md:grid-cols-2 gap-4 md:gap-12 items-center">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-900">
            <EventThumbnail
              event={featuredEvent}
              className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-badge text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {getStatusLabel(featuredEvent)}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-display text-lg sm:text-3xl font-bold text-zinc-900 leading-tight mb-1.5 sm:mb-4">
              {getTitle(featuredEvent)}
            </h3>

            {(formattedDate || place) && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs sm:text-sm text-zinc-600 mb-2 sm:mb-6">
                {formattedDate && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                )}
                {place && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 shrink-0" />
                    <span className="line-clamp-1">{place}</span>
                  </div>
                )}
              </div>
            )}

            <span className="inline-flex flex-col items-center md:items-start text-xs font-semibold uppercase tracking-widest text-zinc-900">
              <span className="inline-flex items-center gap-2">
                Go to Scoreboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <span className="mt-1.5 sm:mt-2 h-px w-full bg-zinc-300 group-hover:bg-zinc-900 transition-colors" />
            </span>
          </div>
        </Link>

        {otherLiveEvents.length > 0 && (
          <div className="mt-6 pt-5 border-t border-zinc-100 flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-3">
            {otherLiveEvents.map((event) => (
              <Link
                key={event.id}
                href={getEventPath(event, true)}
                className="group flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shrink-0" />
                <span className="font-medium line-clamp-1">{getTitle(event)}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}
