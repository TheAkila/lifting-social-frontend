'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaBox, FaNewspaper, FaUsers, FaChartBar, FaCalendar, FaUserTie, FaRss } from 'react-icons/fa'
import api from '@/lib/api'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    products: 0,
    rssFeeds: 0,
    athletes: 0,
    events: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user === null) {
      router.push('/login?redirect=/admin')
    } else if (user && user.role !== 'admin') {
      // User is logged in but not an admin
      alert('Access denied. Admin privileges required.')
      router.push('/')
    } else if (user) {
      loadStats()
    }
  }, [user, router])

  const loadStats = async () => {
    try {
      const [productsRes, rssFeedsRes, athletesRes, eventsRes] = await Promise.all([
        api.get('/products'),
        api.get('/rss-feeds'),
        api.get('/athletes'),
        api.get('/events'),
      ])
      setStats({
        products: productsRes.data.length,
        rssFeeds: rssFeedsRes.data.length,
        athletes: athletesRes.data.length,
        events: eventsRes.data.length,
      })
      setLoading(false)
    } catch (err) {
      console.error('Failed to load stats', err)
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name || 'Admin'}! Manage your content and data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Products Card */}
          <Link href="/admin/products">
            <div className="bg-white rounded-[12px] p-6 hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-[10px] bg-blue-500/10 flex items-center justify-center">
                  <FaBox className="text-xl text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                  <p className="text-gray-600 text-sm">Manage shop items</p>
                </div>
              </div>
            </div>
          </Link>

          {/* RSS Feeds Card - Primary Blog Management */}
          <Link href="/admin/rss-feeds">
            <div className="bg-white rounded-[12px] p-6 hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-[10px] bg-orange-500/10 flex items-center justify-center">
                  <FaRss className="text-xl text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Blog Feeds</h3>
                  <p className="text-gray-600 text-sm">RSS aggregation</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Athletes Card */}
          <Link href="/admin/athletes">
            <div className="bg-white rounded-[12px] p-6 hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-[10px] bg-purple-500/10 flex items-center justify-center">
                  <FaUsers className="text-xl text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Athletes</h3>
                  <p className="text-gray-600 text-sm">Manage profiles</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Coaches Card */}
          <Link href="/admin/coaches">
            <div className="bg-white rounded-[12px] p-6 hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-[10px] bg-green-500/10 flex items-center justify-center">
                  <FaUserTie className="text-xl text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Coaches</h3>
                  <p className="text-gray-600 text-sm">Manage coaches</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Events Card */}
          <Link href="/admin/events">
            <div className="bg-white rounded-[12px] p-6 hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-[10px] bg-indigo-500/10 flex items-center justify-center">
                  <FaCalendar className="text-xl text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Events</h3>
                  <p className="text-gray-600 text-sm">Manage events</p>
                </div>
              </div>
            </div>
          </Link>

          {/* RSS Feeds Card */}
          <Link href="/admin/stories">
            <div className="bg-white rounded-[12px] p-6 hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-[10px] bg-pink-500/10 flex items-center justify-center">
                  <FaNewspaper className="text-xl text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Stories</h3>
                  <p className="text-gray-600 text-sm">Manage content</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-[12px] p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          {loading ? (
            <p className="text-center py-4 text-gray-600">Loading stats...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-[10px]">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats.products}</div>
                <div className="text-gray-600 text-xs">Total Products</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-[10px]">
                <div className="text-2xl font-bold text-orange-600 mb-1">{stats.rssFeeds}</div>
                <div className="text-gray-600 text-xs">RSS Feeds</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-[10px]">
                <div className="text-2xl font-bold text-purple-600 mb-1">{stats.athletes}</div>
                <div className="text-gray-600 text-xs">Active Athletes</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-[10px]">
                <div className="text-2xl font-bold text-indigo-600 mb-1">{stats.events}</div>
                <div className="text-gray-600 text-xs">Total Events</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
