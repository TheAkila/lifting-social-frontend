'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FaShoppingBag, 
  FaHeart, 
  FaBook, 
  FaUser, 
  FaCog,
  FaBox,
  FaCreditCard
} from 'react-icons/fa'

interface Order {
  _id: string
  orderNumber: string
  total: number
  orderStatus: string
  createdAt: string
  items: any[]
}

interface EnrolledProgram {
  programId: {
    _id: string
    name: string
    title: string
    image?: string
  }
  progress: number
  status: string
  enrolledAt: string
}

export default function UserDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [programs, setPrograms] = useState<EnrolledProgram[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user && user.role === 'admin') {
      router.push('/admin')
      return
    }

    if (user) {
      loadDashboardData()
    }
  }, [user, authLoading, router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load recent orders
      const ordersRes = await api.get('/orders')
      setOrders(ordersRes.data.slice(0, 5)) // Show only 5 most recent
      
      // Load enrolled programs
      const programsRes = await api.get('/programs/enrolled')
      setPrograms(programsRes.data)
      
      // Load wishlist count
      const profileRes = await api.get('/profile')
      setWishlistCount(profileRes.data.wishlist?.length || 0)
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-brand-light/70">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      icon: FaShoppingBag,
      label: 'Total Orders',
      value: orders.length,
      color: 'bg-blue-500',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconBg: 'bg-blue-500',
      link: '/dashboard/orders'
    },
    {
      icon: FaHeart,
      label: 'Wishlist Items',
      value: wishlistCount,
      color: 'bg-red-500',
      gradient: 'from-red-500/20 to-pink-500/20',
      iconBg: 'bg-red-500',
      link: '/dashboard/wishlist'
    },
    {
      icon: FaBook,
      label: 'Programs Enrolled',
      value: programs.length,
      color: 'bg-green-500',
      gradient: 'from-green-500/20 to-teal-500/20',
      iconBg: 'bg-green-500',
      link: '/dashboard/programs'
    }
  ]

  const quickActions = [
    {
      icon: FaShoppingBag,
      label: 'Browse Shop',
      href: '/shop',
      color: 'from-brand-primary/20 to-brand-secondary/20',
      iconColor: 'bg-brand-primary'
    },
    {
      icon: FaBook,
      label: 'View Programs',
      href: '/coaching',
      color: 'from-brand-accent/20 to-brand-primary/20',
      iconColor: 'bg-brand-accent'
    },
    {
      icon: FaUser,
      label: 'Edit Profile',
      href: '/dashboard/profile',
      color: 'from-purple-500/20 to-blue-500/20',
      iconColor: 'bg-purple-500'
    },
    {
      icon: FaCog,
      label: 'Settings',
      href: '/dashboard/settings',
      color: 'from-brand-secondary/20 to-brand-accent/20',
      iconColor: 'bg-brand-secondary'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
      processing: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
      shipped: 'bg-purple-500/20 text-purple-400 border-purple-400/30',
      delivered: 'bg-green-500/20 text-green-400 border-green-400/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-400/30',
      active: 'bg-green-500/20 text-green-400 border-green-400/30',
      completed: 'bg-blue-500/20 text-blue-400 border-blue-400/30'
    }
    return colors[status] || 'bg-brand-light/10 text-brand-light/70 border-brand-light/20'
  }

  return (
    <div className="min-h-screen bg-brand-dark pt-28 pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-brand-light/70">Here's what's happening with your account</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link href={stat.link} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br ${stat.gradient}`}
              >
                <div className="flex items-center">
                  <div className={`${stat.iconBg} w-16 h-16 rounded-full flex items-center justify-center`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-brand-light/70">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link href={action.href} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br ${action.color} text-center`}
                >
                  <div className={`${action.iconColor} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold">{action.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-brand-accent hover:text-brand-accent/80 font-semibold transition-colors">
              View All →
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="card text-center py-12">
              <FaBox className="w-16 h-16 text-brand-light/30 mx-auto mb-4" />
              <p className="text-brand-light/70 mb-4">No orders yet</p>
              <Link href="/shop" className="btn-primary inline-block">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-brand-light/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-light/70 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-light/70 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-light/70 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-light/70 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-light/70 uppercase tracking-wider">Items</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-light/10">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-brand-light/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/dashboard/orders/${order._id}`} className="text-brand-accent hover:text-brand-accent/80 font-semibold">
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-light/70">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                          LKR {order.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-light/70">
                          {order.items.length} item(s)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Enrolled Programs */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Programs</h2>
            <Link href="/dashboard/programs" className="text-brand-accent hover:text-brand-accent/80 font-semibold transition-colors">
              View All →
            </Link>
          </div>
          {programs.length === 0 ? (
            <div className="card text-center py-12">
              <FaBook className="w-16 h-16 text-brand-light/30 mx-auto mb-4" />
              <p className="text-brand-light/70 mb-4">No programs enrolled yet</p>
              <Link href="/coaching" className="btn-primary inline-block">
                Browse Programs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.slice(0, 3).map((program, index) => (
                <motion.div
                  key={program.programId._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card hover:scale-105 transition-transform"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg">{program.programId.name}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(program.status)}`}>
                      {program.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-brand-light/70 mb-4">{program.programId.title}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-brand-light/70">Progress</span>
                      <span className="font-semibold">{program.progress}%</span>
                    </div>
                    <div className="w-full bg-brand-light/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-brand-primary to-brand-accent h-2 rounded-full transition-all duration-500"
                        style={{ width: `${program.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link 
                    href={`/dashboard/programs/${program.programId._id}`}
                    className="block text-center py-2 px-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg transition-colors font-semibold"
                  >
                    Continue
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
