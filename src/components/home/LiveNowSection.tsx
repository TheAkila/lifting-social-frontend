'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Radio, Calendar, MapPin } from 'lucide-react'
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
    return (
      <section className="bg-zinc-50 border-y border-zinc-200">
        <div className="container-custom py-6">
          <div className="h-24 bg-white border border-zinc-200 rounded-xl animate-pulse" />
        </div>
      </section>
    )
  }

  if (liveEvents.length === 0) {
    return (
      <section className="bg-zinc-50 border-y border-zinc-200">
        <div className="container-custom py-6 flex items-center justify-between gap-4 flex-col sm:flex-row">
          <div>
            <p className="text-sm font-semibold text-zinc-900">No Live Event Right Now</p>
            <p className="text-sm text-zinc-600 mt-1">Follow upcoming competitions from the dedicated live center.</p>
          </div>
          <Link href="/live" className="px-4 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors">
            Open Live Center
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-red-50 border-y border-red-100">
      <div className="container-custom py-6">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-red-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-zinc-900">Live Now</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {liveEvents.slice(0, 2).map((event) => (
            <Link
              key={event.id}
              href={getEventPath(event, true)}
              className="bg-white border border-red-200 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">LIVE</span>
                <span className="text-xs text-zinc-500">{getStatus(event) || 'in progress'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-900 mb-2">{getTitle(event)}</h3>
              <div className="space-y-1.5 text-sm text-zinc-600">
                {getDate(event) && (
                  <p className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(getDate(event)).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                )}
                {(event.location || event.venue) && (
                  <p className="inline-flex items-center gap-2"><MapPin className="w-4 h-4" />{event.location || event.venue}</p>
                )}
              </div>
              <p className="text-sm text-red-700 font-medium mt-3">Watch live scoreboard →</p>
            </Link>
          ))}
        </div>

        <div className="mt-4">
          <Link href="/live" className="text-sm font-medium text-red-700 hover:text-red-800">
            View all live and upcoming events →
          </Link>
        </div>
      </div>
    </section>
  )
}
