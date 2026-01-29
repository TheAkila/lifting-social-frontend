'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSync, FaCheck, FaTimes, FaClock } from 'react-icons/fa'

interface RSSFeed {
  id: string
  name: string
  url: string
  description: string
  category: string
  active: boolean
  last_fetched_at: string | null
  fetch_interval_hours: number
  created_at: string
  updated_at: string
}

export default function AdminRSSFeeds() {
  const { user } = useAuth()
  const router = useRouter()
  const [feeds, setFeeds] = useState<RSSFeed[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFeed, setEditingFeed] = useState<RSSFeed | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshingId, setRefreshingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    category: 'Weightlifting',
    active: true,
    fetch_interval_hours: 6,
  })

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/admin/rss-feeds')
      return
    }
    loadFeeds()
  }, [user])

  const loadFeeds = async () => {
    try {
      const res = await api.get('/rss-feeds')
      setFeeds(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load RSS feeds', err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingFeed) {
        await api.put(`/rss-feeds/${editingFeed.id}`, formData)
      } else {
        await api.post('/rss-feeds', formData)
      }

      setShowForm(false)
      setEditingFeed(null)
      resetForm()
      loadFeeds()
      alert('RSS feed saved successfully!')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save RSS feed')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this RSS feed?')) return
    try {
      await api.delete(`/rss-feeds/${id}`)
      alert('RSS feed deleted successfully!')
      loadFeeds()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete RSS feed')
    }
  }

  const handleEdit = (feed: RSSFeed) => {
    setEditingFeed(feed)
    setFormData({
      name: feed.name,
      url: feed.url,
      description: feed.description || '',
      category: feed.category || 'Weightlifting',
      active: feed.active,
      fetch_interval_hours: feed.fetch_interval_hours || 6,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      description: '',
      category: 'Weightlifting',
      active: true,
      fetch_interval_hours: 6,
    })
  }

  const handleRefreshAll = async () => {
    if (!confirm('Refresh all RSS feeds now? This will fetch the latest posts.')) return
    setRefreshing(true)
    try {
      const res = await api.post('/rss-feeds/refresh')
      alert(`Success! Processed ${res.data.feedsProcessed} feeds and saved ${res.data.newPosts} new posts.`)
      loadFeeds()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to refresh feeds')
    } finally {
      setRefreshing(false)
    }
  }

  const handleRefreshSingle = async (id: string, name: string) => {
    if (!confirm(`Refresh "${name}" now?`)) return
    setRefreshingId(id)
    try {
      const res = await api.post(`/rss-feeds/${id}/refresh`)
      alert(`Success! Saved ${res.data.newPosts} new posts from ${name}.`)
      loadFeeds()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to refresh feed')
    } finally {
      setRefreshingId(null)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString()
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
              <FaArrowLeft className="text-2xl" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">RSS Feeds</h1>
              <p className="text-gray-600 mt-1">Manage blog aggregation sources</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefreshAll}
              disabled={refreshing}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-[10px] flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {refreshing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <FaSync />
                  <span>Refresh All</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowForm(!showForm)
                setEditingFeed(null)
                resetForm()
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-[10px] flex items-center gap-2 font-semibold transition-colors"
            >
              <FaPlus />
              <span>Add Feed</span>
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-[12px] p-6 mb-8 border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingFeed ? 'Edit RSS Feed' : 'Add New RSS Feed'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Feed Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-[10px] text-gray-900 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Weightlifting House"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Feed URL *</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-[10px] text-gray-900 focus:outline-none focus:border-blue-500"
                    placeholder="https://example.com/feed"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-[10px] text-gray-900 focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="Brief description of this feed source"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-[10px] text-gray-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Weightlifting">Weightlifting</option>
                    <option value="Training">Training</option>
                    <option value="Strength">Strength</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="News">News</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fetch Interval (hours)</label>
                  <input
                    type="number"
                    value={formData.fetch_interval_hours}
                    onChange={(e) => setFormData({ ...formData, fetch_interval_hours: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-[10px] text-gray-900 focus:outline-none focus:border-blue-500"
                    min="1"
                    max="168"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {formData.active ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-[10px] font-semibold transition-colors"
                >
                  {editingFeed ? 'Update Feed' : 'Add Feed'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingFeed(null)
                    resetForm()
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-2 rounded-[10px] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Feeds List */}
        {loading ? (
          <div className="text-center text-gray-600 py-12">Loading RSS feeds...</div>
        ) : feeds.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <p>No RSS feeds yet. Add your first feed to start aggregating content.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feeds.map((feed) => (
              <div key={feed.id} className="bg-white rounded-[12px] p-6 hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{feed.name}</h3>
                      {feed.active ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <FaCheck className="text-xs" />
                          Active
                        </span>
                      ) : (
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <FaTimes className="text-xs" />
                          Inactive
                        </span>
                      )}
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {feed.category}
                      </span>
                    </div>
                    {feed.description && (
                      <p className="text-gray-600 text-sm mb-2">{feed.description}</p>
                    )}
                    <a
                      href={feed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:text-blue-800 transition-colors break-all"
                    >
                      {feed.url}
                    </a>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaClock />
                        Every {feed.fetch_interval_hours}h
                      </span>
                      <span>Last fetched: {formatDate(feed.last_fetched_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleRefreshSingle(feed.id, feed.name)}
                      disabled={refreshingId === feed.id}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-[10px] transition-colors disabled:opacity-50"
                      title="Refresh this feed"
                    >
                      {refreshingId === feed.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      ) : (
                        <FaSync />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(feed)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-[10px] transition-colors"
                      title="Edit feed"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(feed.id)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-[10px] transition-colors"
                      title="Delete feed"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
