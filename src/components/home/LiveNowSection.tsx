'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Radio, Calendar, MapPin, Trophy, ArrowRight } from 'lucide-react'
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

function getStatus(event: EventItem) {
  return (event.competition_status || event.event_status || event.status || '').toLowerCase()
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

export default function LiveNowSection() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const liveResponse = await api.get('/wl-system/live/events')
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

  if (loading) {
    return null
  }

  if (liveEvents.length === 0) {
    return null
  }

  const featuredEvent = liveEvents[0]

  return (
    <section className="bg-zinc-50 border-y border-zinc-100">
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center relative">
              <span className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-75" />
              <Radio className="w-5 h-5 text-red-600 relative z-10" />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900">
                Live Right Now
              </h2>
              <p className="text-zinc-500 mt-1.5 text-sm sm:text-base font-medium">
                Tune in to the action happening straight from the platform
              </p>
            </div>
          </div>
          <Link
            href="/live"
            className="hidden md:inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 text-sm font-medium transition-colors group"
          >
            <span>View All Live Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <Link
          href={getEventPath(featuredEvent, true)}
          className="group block bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300 relative max-w-5xl mx-auto flex flex-col md:flex-row"
        >
          <div className="relative w-full md:w-[45%] lg:w-[40%] aspect-video md:aspect-auto overflow-hidden bg-zinc-100">
            {featuredEvent.cover_image ? (
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(${featuredEvent.cover_image})` }} 
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-zinc-700" />
              </div>
            )}
            {/* Fade Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent md:bg-gradient-to-r md:from-transparent to-black/10 md:to-transparent" />
            
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center gap-1.5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          </div>

          <div className="w-full md:w-[55%] lg:w-[60%] p-5 sm:p-6 md:p-8 flex flex-col justify-center bg-white relative z-10">
            <div className="mb-auto">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                  <span className="text-red-600 font-bold">Currently Happening</span>
                  <span>•</span>
                  <span>{getStatus(featuredEvent) || 'In Progress'}</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 leading-tight mb-5">
                  {getTitle(featuredEvent)}
                </h3>

                <div className="space-y-3 text-sm text-zinc-600 bg-zinc-50 rounded-[12px] p-4 border border-zinc-100">
                  {getDate(featuredEvent) && (
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                      <span className="font-medium text-zinc-700">
                        {new Date(getDate(featuredEvent)).toLocaleString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                  {(featuredEvent.location || featuredEvent.venue) && (
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                      <span className="font-medium text-zinc-700 line-clamp-1">
                        {featuredEvent.location || featuredEvent.venue}
                      </span>
                    </div>
                  )}
                </div>
              </div>

            <div className="mt-8 flex items-center">
              <div className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 md:py-2.5 rounded-lg text-sm font-semibold w-full sm:w-auto text-center flex items-center justify-center gap-2 transition-colors shadow-sm">
                <span>Enter Scoreboard</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>

        <div className="mt-6 md:mt-8 flex justify-center md:hidden">
          <Link href="/live" className="text-sm font-medium text-red-600 hover:text-red-700">
            View all live and upcoming events →
          </Link>
        </div>
      </div>
    </section>
  )
}
