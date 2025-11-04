'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaBox, FaNewspaper, FaUsers, FaChartBar } from 'react-icons/fa'
import api from '@/lib/api'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    products: 0,
    stories: 0,
    athletes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user === null) {
      router.push('/login?redirect=/admin')
    } else if (user) {
      loadStats()
    }
  }, [user, router])

  const loadStats = async () => {
    try {
      const [productsRes, storiesRes, athletesRes] = await Promise.all([
        api.get('/products'),
        api.get('/stories'),
        api.get('/athletes'),
      ])
      setStats({
        products: productsRes.data.length,
        stories: storiesRes.data.length,
        athletes: athletesRes.data.length,
      })
      setLoading(false)
    } catch (err) {
      console.error('Failed to load stats', err)
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-light/70">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark py-12">
      <div className="container-custom">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Admin Dashboard</h1>
            <p className="text-brand-light/70">Welcome, {user?.name || 'Admin'}! Manage your content and data</p>
          </div>
          <button
            onClick={() => {
              logout()
              router.push('/login')
            }}
            className="btn-outline"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Products Card */}
          <Link href="/admin/products">
            <div className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center">
                  <FaBox className="text-3xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Products</h3>
                  <p className="text-brand-light/70">Manage shop items</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Stories Card */}
          <Link href="/admin/stories">
            <div className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-brand-accent/20 to-brand-primary/20">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-brand-accent flex items-center justify-center">
                  <FaNewspaper className="text-3xl text-brand-dark" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Stories</h3>
                  <p className="text-brand-light/70">Manage blog posts</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Athletes Card */}
          <Link href="/admin/athletes">
            <div className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-brand-secondary/20 to-brand-accent/20">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-brand-secondary flex items-center justify-center">
                  <FaUsers className="text-3xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Athletes</h3>
                  <p className="text-brand-light/70">Manage profiles</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Analytics Card */}
          <div className="card bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center">
                <FaChartBar className="text-3xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Analytics</h3>
                <p className="text-brand-light/70">Coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Quick Stats</h2>
          {loading ? (
            <p className="text-center py-8 text-brand-light/70">Loading stats...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-brand-secondary/20 rounded-lg">
                <div className="text-4xl font-bold text-brand-primary mb-2">{stats.products}</div>
                <div className="text-brand-light/70">Total Products</div>
              </div>
              <div className="text-center p-6 bg-brand-secondary/20 rounded-lg">
                <div className="text-4xl font-bold text-brand-accent mb-2">{stats.stories}</div>
                <div className="text-brand-light/70">Published Stories</div>
              </div>
              <div className="text-center p-6 bg-brand-secondary/20 rounded-lg">
                <div className="text-4xl font-bold text-brand-secondary mb-2">{stats.athletes}</div>
                <div className="text-brand-light/70">Active Athletes</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
