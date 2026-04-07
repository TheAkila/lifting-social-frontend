'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Radio, Trophy } from 'lucide-react'
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
  const [liveNow, setLiveNow] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const liveResponse = await api.get('/wl-system/live/events', {
          headers: { 'X-Suppress-Global-Error': '1' }
        })

        if (isMounted) {
          setLiveNow(Array.isArray(liveResponse.data?.live_now) ? liveResponse.data.live_now : [])
          setLastUpdated(liveResponse.data?.last_updated ? new Date(liveResponse.data.last_updated) : new Date())
        }
      } catch {
        if (isMounted) {
          setLiveNow([])
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

  const effectiveLiveNow = liveNow

  return (
    <div className="min-h-screen pt-28 pb-20 bg-zinc-50">
      <div className="container-custom">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 bg-white border border-zinc-200 rounded-xl animate-pulse" />
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
                  No active competition at the moment.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {effectiveLiveNow.map((event) => (
                    <Link
                      key={event.id}
                      href={getEventPath(event, true)}
                      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative w-full overflow-hidden bg-zinc-100 border-b border-zinc-200 aspect-[16/9] flex-shrink-0">
                        {event.cover_image ? (
                          <Image
                            src={event.cover_image}
                            alt={getEventTitle(event)}
                            fill
                            className="object-contain"
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-zinc-200">
                            <Trophy className="w-16 h-16 text-zinc-400" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-white/90 animate-pulse" />
                          LIVE
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                            {getEventTitle(event)}
                          </h3>
                        </div>

                        <div className="text-sm font-medium text-red-600 group-hover:text-red-700 inline-flex items-center gap-2 mt-auto">
                          <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <Radio className="w-3.5 h-3.5 text-red-600" />
                          </div>
                          <span className="font-semibold group-hover:underline underline-offset-2">Watch live scoreboard →</span>
                        </div>
                      </div>
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
