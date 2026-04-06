'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Radio, Clock3, Trophy } from 'lucide-react'
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
  end_date?: string
  competition_status?: string
  event_status?: string
  status?: string
  cover_image?: string
}

const LIVE_STATUSES = ['in_progress', 'live', 'active', 'ongoing']
const UPCOMING_STATUSES = ['scheduled', 'registration_open', 'entries_closed', 'upcoming']
const COMPLETED_STATUSES = ['completed', 'finished']

function getEventStatus(event: EventItem) {
  return (event.competition_status || event.event_status || event.status || '').toLowerCase()
}

function getEventTitle(event: EventItem) {
  return event.title || event.name || 'Untitled Event'
}

function getEventDate(event: EventItem) {
  return event.start_date || event.date || ''
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

function getEventPath(event: EventItem, preferLive: boolean) {
  const identifier = event.slug || (isUuid(event.id) ? event.id : event.id)
  if (preferLive) return `/events/${identifier}/live`
  return `/events/${identifier}`
}

function formatDate(dateStr: string) {
  if (!dateStr) return 'Date TBA'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return 'Date TBA'
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

export default function LivePage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [liveNow, setLiveNow] = useState<EventItem[]>([])
  const [upcoming, setUpcoming] = useState<EventItem[]>([])
  const [completed, setCompleted] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        try {
          const liveResponse = await api.get('/wl-system/live/events')

          if (isMounted) {
            setLiveNow(Array.isArray(liveResponse.data?.live_now) ? liveResponse.data.live_now : [])
            setUpcoming(Array.isArray(liveResponse.data?.upcoming) ? liveResponse.data.upcoming : [])
            setCompleted(Array.isArray(liveResponse.data?.completed) ? liveResponse.data.completed : [])
            setLastUpdated(liveResponse.data?.last_updated ? new Date(liveResponse.data.last_updated) : new Date())
          }
        } catch {
          const response = await api.get('/events')
          const items = Array.isArray(response.data) ? response.data : []

          if (isMounted) {
            setEvents(items)
            setLastUpdated(new Date())
          }
        }
      } catch {
        if (isMounted) {
          setEvents([])
          setLiveNow([])
          setUpcoming([])
          setCompleted([])
        }
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

  const fallbackBuckets = useMemo(() => {
    const byDate = [...events].sort((a, b) => {
      const ad = new Date(getEventDate(a)).getTime()
      const bd = new Date(getEventDate(b)).getTime()
      if (Number.isNaN(ad) && Number.isNaN(bd)) return 0
      if (Number.isNaN(ad)) return 1
      if (Number.isNaN(bd)) return -1
      return ad - bd
    })

    const live = byDate.filter((e) => LIVE_STATUSES.includes(getEventStatus(e)))
    const up = byDate.filter((e) => UPCOMING_STATUSES.includes(getEventStatus(e)))
    const done = byDate.filter((e) => COMPLETED_STATUSES.includes(getEventStatus(e))).reverse()

    return { liveNow: live, upcoming: up, completed: done }
  }, [events])

  const effectiveLiveNow = liveNow.length > 0 || upcoming.length > 0 || completed.length > 0 ? liveNow : fallbackBuckets.liveNow
  const effectiveUpcoming = liveNow.length > 0 || upcoming.length > 0 || completed.length > 0 ? upcoming : fallbackBuckets.upcoming
  const effectiveCompleted = liveNow.length > 0 || upcoming.length > 0 || completed.length > 0 ? completed : fallbackBuckets.completed

  return (
    <div className="min-h-screen pt-20 bg-zinc-50">
      <div className="container-custom section-padding">
        <div className="mb-8 sm:mb-10">
          <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">Live Competitions</h1>
              <p className="text-zinc-600 mt-2">
                Real-time competition tracking and quick access to active sessions.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-zinc-200">
              <Radio className={`w-4 h-4 ${liveNow.length > 0 ? 'text-red-500' : 'text-zinc-400'}`} />
              <span className="text-sm font-medium text-zinc-700">
                {effectiveLiveNow.length > 0 ? `${effectiveLiveNow.length} Live Now` : 'No Live Event'}
              </span>
            </div>
          </div>
          {lastUpdated && (
            <p className="text-xs text-zinc-500 mt-3">
              Last updated: {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 bg-white border border-zinc-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Radio className="w-5 h-5 text-red-500" />
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900">Live Now</h2>
              </div>

              {effectiveLiveNow.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-xl p-6 text-zinc-600">
                  No active competition at the moment. Check upcoming sessions below.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {effectiveLiveNow.map((event) => (
                    <Link
                      key={event.id}
                      href={getEventPath(event, true)}
                      className="bg-white border border-red-200 rounded-xl p-5 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">LIVE</span>
                        <span className="text-xs text-zinc-500">{getEventStatus(event) || 'in progress'}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-900 mb-2">{getEventTitle(event)}</h3>
                      <div className="space-y-1.5 text-sm text-zinc-600">
                        <p className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" />{formatDate(getEventDate(event))}</p>
                        {(event.location || event.venue) && (
                          <p className="inline-flex items-center gap-2"><MapPin className="w-4 h-4" />{event.location || event.venue}</p>
                        )}
                      </div>
                      <p className="text-sm text-blue-600 font-medium mt-4">Watch live scoreboard →</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock3 className="w-5 h-5 text-zinc-700" />
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900">Upcoming</h2>
              </div>

              {effectiveUpcoming.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-xl p-6 text-zinc-600">No upcoming competitions found.</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {effectiveUpcoming.slice(0, 8).map((event) => (
                    <Link
                      key={event.id}
                      href={getEventPath(event, false)}
                      className="bg-white border border-zinc-200 rounded-xl p-5 hover:shadow-md transition-all"
                    >
                      <h3 className="text-lg font-semibold text-zinc-900 mb-2">{getEventTitle(event)}</h3>
                      <div className="space-y-1.5 text-sm text-zinc-600">
                        <p className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" />{formatDate(getEventDate(event))}</p>
                        {(event.location || event.venue) && (
                          <p className="inline-flex items-center gap-2"><MapPin className="w-4 h-4" />{event.location || event.venue}</p>
                        )}
                      </div>
                      <p className="text-sm text-zinc-700 font-medium mt-4">View event details →</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-zinc-700" />
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900">Recently Completed</h2>
              </div>

              {effectiveCompleted.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-xl p-6 text-zinc-600">No completed competitions yet.</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {effectiveCompleted.slice(0, 6).map((event) => (
                    <Link
                      key={event.id}
                      href={getEventPath(event, false)}
                      className="bg-white border border-zinc-200 rounded-xl p-5 hover:shadow-md transition-all"
                    >
                      <h3 className="text-lg font-semibold text-zinc-900 mb-2">{getEventTitle(event)}</h3>
                      <div className="space-y-1.5 text-sm text-zinc-600">
                        <p className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" />{formatDate(getEventDate(event))}</p>
                        {(event.location || event.venue) && (
                          <p className="inline-flex items-center gap-2"><MapPin className="w-4 h-4" />{event.location || event.venue}</p>
                        )}
                      </div>
                      <p className="text-sm text-zinc-700 font-medium mt-4">See results and details →</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
