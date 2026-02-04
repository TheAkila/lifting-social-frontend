'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, Edit2, Trash2, Filter } from 'lucide-react'
import StarRating from '@/components/shop/StarRating'
import ReviewForm from './ReviewForm'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface Review {
  id: string
  rating: number
  title: string
  comment: string
  created_at: string
  updated_at: string
  helpful_count: number
  verified_purchase: boolean
  users: {
    full_name: string
  }
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface ProductReviewsProps {
  productId: string
  productName: string
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [sortBy, setSortBy] = useState('recent')
  const [filterRating, setFilterRating] = useState<number | null>(null)

  useEffect(() => {
    fetchReviews()
    fetchStats()
    if (user) {
      checkUserReview()
    }
  }, [productId, sortBy, filterRating, user])

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams({ sortBy })
      if (filterRating) params.append('rating', filterRating.toString())
      
      const res = await api.get(`/reviews/product/${productId}?${params}`)
      setReviews(res.data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await api.get(`/reviews/product/${productId}/stats`)
      setStats(res.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const checkUserReview = async () => {
    try {
      const res = await api.get(`/reviews/check/${productId}`)
      if (res.data.hasReviewed) {
        setUserReview(res.data.review)
      }
    } catch (error) {
      console.error('Error checking user review:', error)
    }
  }

  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    fetchReviews()
    fetchStats()
    checkUserReview()
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete your review?')) return

    try {
      await api.delete(`/reviews/${reviewId}`)
      setUserReview(null)
      fetchReviews()
      fetchStats()
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getRatingPercentage = (rating: number) => {
    if (!stats || stats.totalReviews === 0) return 0
    return Math.round((stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100)
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto"></div>
        <p className="text-zinc-600 mt-4">Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="py-6 sm:py-8 lg:py-12">
      {/* Reviews Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl text-zinc-900 mb-4 sm:mb-6">
          Customer Reviews
        </h2>

        {/* Rating Summary */}
        {stats && stats.totalReviews > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Overall Rating */}
            <div className="bg-zinc-50 rounded-lg sm:rounded-[12px] p-4 sm:p-6">
              <div className="text-center mb-3 sm:mb-4">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-zinc-900 mb-2">
                  {stats.averageRating.toFixed(1)}
                </div>
                <StarRating rating={stats.averageRating} readonly size="lg" />
                <p className="text-xs sm:text-sm text-zinc-600 mt-2">
                  Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-1.5 sm:space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                  className={`w-full flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-md sm:rounded-[8px] transition-colors ${
                    filterRating === rating ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-1 min-w-[60px] sm:min-w-[80px]">
                    <span className="text-xs sm:text-sm font-medium text-zinc-700">{rating}</span>
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-1.5 sm:h-2 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${getRatingPercentage(rating)}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-zinc-600 min-w-[35px] sm:min-w-[45px] text-right">
                    {getRatingPercentage(rating)}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-zinc-50 rounded-lg sm:rounded-[12px] p-6 sm:p-8 text-center mb-6 sm:mb-8">
            <Star className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-400 mx-auto mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base text-zinc-600">No reviews yet. Be the first to review this product!</p>
          </div>
        )}

        {/* Write Review Button */}
        {user && !userReview && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm sm:text-base rounded-md sm:rounded-[8px] transition-colors"
          >
            Write a Review
          </button>
        )}

        {/* User's Review Card */}
        {userReview && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-[12px] p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-900 mb-1.5 sm:mb-2">Your Review</p>
                <StarRating rating={userReview.rating} readonly />
              </div>
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="p-1.5 sm:p-2 hover:bg-blue-100 rounded-md sm:rounded-[8px] transition-colors"
                  aria-label="Edit review"
                >
                  <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700" />
                </button>
                <button
                  onClick={() => handleDeleteReview(userReview.id)}
                  className="p-1.5 sm:p-2 hover:bg-red-100 rounded-md sm:rounded-[8px] transition-colors"
                  aria-label="Delete review"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                </button>
              </div>
            </div>
            <h4 className="font-semibold text-sm sm:text-base text-zinc-900 mb-1.5 sm:mb-2">{userReview.title}</h4>
            <p className="text-zinc-700 text-xs sm:text-sm">{userReview.comment}</p>
            <p className="text-[10px] sm:text-xs text-zinc-500 mt-2 sm:mt-3">
              Posted on {formatDate(userReview.created_at)}
            </p>
          </div>
        )}
      </div>

      {/* Sort & Filter */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-zinc-200">
          <p className="text-xs sm:text-sm text-zinc-600">
            Showing {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            {filterRating && ` with ${filterRating} stars`}
          </p>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs sm:text-sm border border-zinc-200 rounded-md sm:rounded-[8px] px-2.5 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating_high">Highest Rating</option>
              <option value="rating_low">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        <AnimatePresence mode="popLayout">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-zinc-200 rounded-lg sm:rounded-[12px] p-4 sm:p-5 lg:p-6"
            >
              {/* Review Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <p className="font-semibold text-sm sm:text-base text-zinc-900">
                      {review.users?.full_name || 'Anonymous'}
                    </p>
                    {review.verified_purchase && (
                      <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                  <StarRating rating={review.rating} readonly size="sm" />
                </div>
                <p className="text-[10px] sm:text-xs text-zinc-500">
                  {formatDate(review.created_at)}
                </p>
              </div>

              {/* Review Content */}
              <h4 className="font-semibold text-sm sm:text-base text-zinc-900 mb-1.5 sm:mb-2">{review.title}</h4>
              <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                {review.comment}
              </p>

              {/* Review Actions */}
              <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-zinc-100">
                <button className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                  <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Helpful ({review.helpful_count})</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Reviews After Filter */}
      {reviews.length === 0 && stats && stats.totalReviews > 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-600 mb-4">No reviews match your filter</p>
          <button
            onClick={() => setFilterRating(null)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <ReviewForm
            productId={productId}
            productName={productName}
            existingReview={userReview}
            onSuccess={handleReviewSuccess}
            onClose={() => setShowReviewForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
