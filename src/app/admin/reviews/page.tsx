'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  FaStar, 
  FaFilter, 
  FaSearch, 
  FaTrash,
  FaTimes,
  FaChartBar
} from 'react-icons/fa'

interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  title: string
  comment: string
  helpful_count: number
  verified_purchase: boolean
  created_at: string
  updated_at: string
  products?: {
    name: string
    slug: string
    image: string
  }
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export default function AdminReviewsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Filters
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchReviews()
      fetchStats()
    }
  }, [user])

  useEffect(() => {
    // Apply filters
    let filtered = [...reviews]

    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter))
    }

    if (searchQuery) {
      filtered = filtered.filter(review => 
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.products?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredReviews(filtered)
  }, [reviews, ratingFilter, searchQuery])

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setReviews(data)
        setFilteredReviews(data)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/reviews/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        await fetchReviews()
        await fetchStats()
        setShowReviewModal(false)
        setSelectedReview(null)
      } else {
        alert('Failed to delete review')
      }
    } catch (error) {
      console.error('Failed to delete review:', error)
      alert('Failed to delete review')
    } finally {
      setDeleting(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    )
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800'
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews Management</h1>
            <p className="text-gray-600">Moderate and manage product reviews</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-[10px] hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-[12px] p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-[10px] flex items-center justify-center">
                  <FaStar className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-[10px] flex items-center justify-center">
                  <FaStar className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">5-Star Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.ratingDistribution[5]}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-[10px] flex items-center justify-center">
                  <FaChartBar className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Low Ratings (1-2)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.ratingDistribution[1] + stats.ratingDistribution[2]}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-[10px] flex items-center justify-center">
                  <FaChartBar className="text-red-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rating Distribution Chart */}
        {stats && (
          <div className="bg-white rounded-[12px] p-6 mb-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-sm font-medium text-gray-700">{rating}</span>
                      <FaStar className="text-yellow-400 text-sm" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-16 text-right">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-[12px] p-6 mb-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <span className="text-gray-700 font-medium">Filters:</span>
            </div>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-[8px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews by product or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-[12px] p-12 border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <FaStar className="text-4xl mb-3 text-gray-300" />
                <p className="text-lg font-medium">No reviews found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-[12px] p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Product Info */}
                    {review.products && (
                      <div className="flex items-center gap-3 mb-3">
                        {review.products.image && (
                          <img
                            src={review.products.image}
                            alt={review.products.name}
                            className="w-12 h-12 object-cover rounded-[8px]"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{review.products.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Rating and Title */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRatingColor(review.rating)}`}>
                          {review.rating}/5
                        </span>
                        {review.verified_purchase && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{review.title}</h3>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 mb-3">{review.comment}</p>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Helpful: {review.helpful_count}</span>
                      <span>User: {review.user_id.substring(0, 8)}...</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedReview(review)
                        setShowReviewModal(true)
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-[8px] hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={deleting}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-[8px] hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Details Modal */}
      {showReviewModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[16px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-[16px]">
              <h2 className="text-2xl font-bold text-gray-900">Review Details</h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              {/* Product */}
              {selectedReview.products && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Product</h3>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-[12px]">
                    {selectedReview.products.image && (
                      <img
                        src={selectedReview.products.image}
                        alt={selectedReview.products.name}
                        className="w-16 h-16 object-cover rounded-[8px]"
                      />
                    )}
                    <p className="font-medium text-gray-900">{selectedReview.products.name}</p>
                  </div>
                </div>
              )}

              {/* Rating */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Rating</h3>
                <div className="flex items-center gap-3">
                  {renderStars(selectedReview.rating)}
                  <span className="text-2xl font-bold text-gray-900">{selectedReview.rating}/5</span>
                </div>
              </div>

              {/* Title */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Title</h3>
                <p className="text-lg font-semibold text-gray-900">{selectedReview.title}</p>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Review</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-[12px]">{selectedReview.comment}</p>
              </div>

              {/* Metadata */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Information</h3>
                <div className="space-y-2 bg-gray-50 p-4 rounded-[12px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">User ID:</span>
                    <span className="text-gray-900 font-mono text-sm">{selectedReview.user_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900">{new Date(selectedReview.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated:</span>
                    <span className="text-gray-900">{new Date(selectedReview.updated_at).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Helpful Count:</span>
                    <span className="text-gray-900">{selectedReview.helpful_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verified Purchase:</span>
                    <span className="text-gray-900">{selectedReview.verified_purchase ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteReview(selectedReview.id)}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-[10px] hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaTrash />
                  {deleting ? 'Deleting...' : 'Delete Review'}
                </button>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-[10px] hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
