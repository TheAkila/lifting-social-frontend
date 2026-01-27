'use client'

import { useState, useEffect } from 'react'
import { Rss } from 'lucide-react'
import api from '@/lib/api'

interface RSSFeed {
  id: string
  name: string
  category: string
  active: boolean
}

export default function RSSFeedSources() {
  const [feeds, setFeeds] = useState<RSSFeed[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeeds()
  }, [])

  const loadFeeds = async () => {
    try {
      const res = await api.get('/rss-feeds')
      setFeeds(res.data.filter((f: RSSFeed) => f.active))
      setLoading(false)
    } catch (err) {
      console.error('Failed to load RSS feeds', err)
      setLoading(false)
    }
  }

  if (loading || feeds.length === 0) return null

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-[12px] p-6 mb-8">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
          <Rss className="w-5 h-5 text-orange-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-zinc-900 mb-2">
            Content Sources ({feeds.length} Active)
          </h3>
          <div className="flex flex-wrap gap-2">
            {feeds.map((feed) => (
              <span
                key={feed.id}
                className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1 rounded-full text-xs text-zinc-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {feed.name}
              </span>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Articles are automatically fetched every 6 hours and attributed to their original sources
          </p>
        </div>
      </div>
    </div>
  )
}
