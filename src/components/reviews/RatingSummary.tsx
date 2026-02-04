'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import api from '@/lib/api'

interface RatingSummaryProps {
  productId: string
  size?: 'sm' | 'md'
}

export default function RatingSummary({ productId, size = 'md' }: RatingSummaryProps) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`/reviews/product/${productId}/stats`)
        setStats(res.data)
      } catch (error) {
        console.error('Error fetching rating stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [productId])

  if (loading || !stats || stats.totalReviews === 0) {
    return null
  }

  const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const textSize = size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(stats.averageRating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-zinc-300'
            }`}
          />
        ))}
      </div>
      <span className={`${textSize} font-medium text-zinc-900`}>
        {stats.averageRating.toFixed(1)}
      </span>
      <span className={`${textSize} text-zinc-600`}>
        ({stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  )
}
