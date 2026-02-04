'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, AlertCircle } from 'lucide-react'
import StarRating from './StarRating'
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
  const [title, setTitle] = useState(existingReview?.title || '')
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

    if (title.length < 3) {
      setError('Title must be at least 3 characters')
      return
    }

    if (comment.length < 10) {
      setError('Review must be at least 10 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (existingReview) {
        // Update existing review
        await api.put(`/reviews/${existingReview.id}`, {
          rating,
          title,
          comment
        })
      } else {
        // Create new review
        await api.post('/reviews', {
          productId,
          rating,
          title,
          comment
        })
      }
      
      onSuccess()
    } catch (err: any) {
      console.error('Error submitting review:', err)
      setError(err.response?.data?.error || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-[16px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div>
            <h2 className="font-display font-bold text-2xl text-zinc-900">
              {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h2>
            <p className="text-sm text-zinc-600 mt-1">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-[8px] flex items-center justify-center hover:bg-zinc-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-zinc-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-3">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="lg"
              showLabel
            />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="review-title" className="block text-sm font-semibold text-zinc-900 mb-2">
              Review Title <span className="text-red-500">*</span>
            </label>
            <input
              id="review-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={100}
              className="w-full px-4 py-3 border border-zinc-200 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
            />
            <p className="text-xs text-zinc-500 mt-1">
              {title.length}/100 characters
            </p>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="review-comment" className="block text-sm font-semibold text-zinc-900 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={6}
              maxLength={1000}
              className="w-full px-4 py-3 border border-zinc-200 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all resize-none"
            />
            <p className="text-xs text-zinc-500 mt-1">
              {comment.length}/1000 characters (minimum 10)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-[8px]"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-zinc-200 text-zinc-700 font-medium rounded-[8px] hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-[8px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
