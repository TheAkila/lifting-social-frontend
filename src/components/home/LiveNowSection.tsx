'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Radio, Calendar, MapPin, Trophy } from 'lucide-react'
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
    <section className="bg-white">
      <div className="container-custom py-10 sm:py-12">
        <div className="flex items-center gap-2 mb-5">
          <Radio className="w-5 h-5 text-red-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-zinc-900">Live Right Now</h2>
        </div>

        <Link
          href={getEventPath(featuredEvent, true)}
          className="group block rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="relative md:col-span-5 min-h-[220px] bg-zinc-100">
              {featuredEvent.cover_image ? (
                <Image
                  src={featuredEvent.cover_image}
                  alt={getTitle(featuredEvent)}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-200">
                  <Trophy className="w-14 h-14 text-zinc-400" />
                </div>
              )}
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white/90 animate-pulse" />
                LIVE
              </div>
            </div>

            <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors leading-tight mb-3">
                  {getTitle(featuredEvent)}
                </h3>

                <div className="space-y-2 text-sm text-zinc-600">
                  {getDate(featuredEvent) && (
                    <p className="inline-flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(getDate(featuredEvent)).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                  {(featuredEvent.location || featuredEvent.venue) && (
                    <p className="inline-flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {featuredEvent.location || featuredEvent.venue}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm sm:text-base font-semibold text-red-700 group-hover:text-red-800 mt-6">
                Watch live scoreboard →
              </p>
            </div>
          </div>
        </Link>

        <div className="mt-4">
          <Link href="/live" className="text-sm font-medium text-red-700 hover:text-red-800">
            View all live and upcoming events →
          </Link>
        </div>
      </div>
    </section>
  )
}
