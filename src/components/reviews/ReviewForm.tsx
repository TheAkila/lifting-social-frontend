'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, AlertCircle } from 'lucide-react'
import StarRating from '@/components/shop/StarRating'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface ReviewFormProps {
  productId: string
  productName: string
  onSuccess: () => void
  onClose: () => void
  existingReview?: any
}

export default function ReviewForm({ 
  productId, 
  productName, 
  onSuccess, 
  onClose,
  existingReview 
}: ReviewFormProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('You must be logged in to submit a review')
      return
    }

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    if (comment.length < 10) {
      setError('Review must be at least 10 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Generate a default title based on rating
      const defaultTitle = `${rating} star${rating !== 1 ? 's' : ''} - ${productName}`
      
      if (existingReview) {
        // Update existing review
        await api.put(`/reviews/${existingReview.id}`, {
          rating,
          title: defaultTitle,
          comment
        })
      } else {
        // Create new review
        await api.post('/reviews', {
          productId,
          rating,
          title: defaultTitle,
          comment
        })
      }
      
      onSuccess()
    } catch (err: any) {
      console.error('Error submitting review:', err)
      console.error('Error response:', err.response)
      console.error('Error data:', err.response?.data)
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to submit review'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl sm:rounded-[16px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 lg:p-6 border-b border-zinc-200">
          <div className="flex-1 pr-2">
            <h2 className="font-display font-bold text-lg sm:text-xl lg:text-2xl text-zinc-900">
              {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-0.5 sm:mt-1 line-clamp-1">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-[8px] flex items-center justify-center hover:bg-zinc-100 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-zinc-900 mb-2 sm:mb-3">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="lg"
              showLabel
            />
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="review-comment" className="block text-xs sm:text-sm font-semibold text-zinc-900 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={6}
              maxLength={1000}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-zinc-200 rounded-md sm:rounded-[8px] focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all resize-none"
            />
            <p className="text-[10px] sm:text-xs text-zinc-500 mt-1">
              {comment.length}/1000 characters (minimum 10)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-md sm:rounded-[8px]"
            >
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-red-800">{error}</p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base border border-zinc-200 text-zinc-700 font-medium rounded-md sm:rounded-[8px] hover:bg-zinc-50 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-md sm:rounded-[8px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : (
                existingReview ? 'Update Review' : 'Submit Review'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
