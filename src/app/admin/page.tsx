'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaBox, FaNewspaper, FaChartBar, FaCalendar, FaRss, FaShoppingCart, FaStar, FaHeart, FaDollarSign, FaImages } from 'react-icons/fa'
import api from '@/lib/api'

interface ShopStats {
  orders: {
    total: number
    pending: number
    revenue: number
  }
  reviews: {
    total: number
    averageRating: number
  }
  wishlist: {
    totalItems: number
  }
  recentOrders: Array<{
    id: string
    order_number: string
    total: number
    order_status: string
    created_at: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    products: 0,
    rssFeeds: 0,
    events: 0,
  })
  const [shopStats, setShopStats] = useState<ShopStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)

  // Check auth on mount - read directly from storage
  useEffect(() => {
    console.log('🚀 Admin page mounted, checking auth...')
    const storedUserData = sessionStorage.getItem('userData') || localStorage.getItem('userData')
    const storedToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
    
    console.log('📦 Admin Storage check:')
    console.log('  - userData:', storedUserData ? 'EXISTS' : 'MISSING')
    console.log('  - authToken:', storedToken ? 'EXISTS' : 'MISSING')
    
    if (!storedUserData || !storedToken) {
      console.log('❌ Missing auth data, redirecting to login')
      router.push('/login?redirect=/admin')
      return
    }
    
    try {
      const parsedUser = JSON.parse(storedUserData)
      console.log('✅ Parsed user:', parsedUser.email, '| Role:', parsedUser.role)
      
      if (parsedUser.role !== 'admin') {
        console.log('🚫 Not an admin, redirecting to home')
        alert('Access denied. Admin privileges required.')
        router.push('/')
        return
      }
      
      console.log('✅ Admin verified, loading stats')
      setUser(parsedUser)
      setAuthChecked(true)
      loadStats()
      loadShopStats()
    } catch (e) {
      console.error('❌ Failed to parse user data:', e)
      router.push('/login?redirect=/admin')
    }
  }, [])

  const loadStats = async () => {
    try {
      const [productsRes, rssFeedsRes, eventsRes] = await Promise.all([
        api.get('/products'),
        api.get('/rss-feeds'),
        api.get('/events'),
      ])
      setStats({
        products: productsRes.data.length,
        rssFeeds: rssFeedsRes.data.length,
        events: eventsRes.data.length,
      })
      setLoading(false)
    } catch (err) {
      console.error('Failed to load stats', err)
      setLoading(false)
    }
  }

  const loadShopStats = async () => {
    try {
      const response = await api.get('/admin/stats/shop')
      setShopStats(response.data)
    } catch (err) {
      console.error('Failed to load shop stats', err)
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

          {/* Gallery Card */}
          <Link href="/admin/gallery">
            <div className="bg-white rounded-[12px] p-6 hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-[10px] bg-purple-500/10 flex items-center justify-center">
                  <FaImages className="text-xl text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Gallery</h3>
                  <p className="text-gray-600 text-sm">Manage images</p>
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

          {/* Orders Card */}
          <Link href="/admin/orders">
            <div className="bg-white rounded-[12px] p-6 hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-[10px] bg-teal-500/10 flex items-center justify-center">
                  <FaShoppingCart className="text-xl text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
                  <p className="text-gray-600 text-sm">Manage orders</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Reviews Card */}
          <Link href="/admin/reviews">
            <div className="bg-white rounded-[12px] p-6 hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-[10px] bg-amber-500/10 flex items-center justify-center">
                  <FaStar className="text-xl text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
                  <p className="text-gray-600 text-sm">Moderate reviews</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Shop Statistics */}
        {shopStats && (
          <div className="bg-white rounded-[12px] p-6 mb-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shop Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-[10px]">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  LKR {shopStats.orders.revenue.toLocaleString()}
                </div>
                <div className="text-gray-600 text-xs">Total Revenue</div>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-[10px]">
                <div className="text-2xl font-bold text-teal-600 mb-1">{shopStats.orders.total}</div>
                <div className="text-gray-600 text-xs">Total Orders</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-[10px]">
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  {shopStats.reviews.total}
                </div>
                <div className="text-gray-600 text-xs">Total Reviews</div>
              </div>
            </div>
            
            {/* Additional Shop Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-[10px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Pending Orders</span>
                  <span className="text-xl font-bold text-yellow-600">{shopStats.orders.pending}</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-[10px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-xl font-bold text-gray-900">{shopStats.reviews.averageRating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            {shopStats.recentOrders.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Orders</h3>
                <div className="space-y-2">
                  {shopStats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-[8px]">
                      <div>
                        <p className="text-sm font-medium text-blue-600">{order.order_number}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          LKR {order.total.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">{order.order_status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
