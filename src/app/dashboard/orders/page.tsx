'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaBox, FaEye, FaRedo, FaTimes, FaFilter } from 'react-icons/fa'

interface Order {
  id: string
  order_number: string
  total: number
  subtotal: number
  tax: number
  shipping_fee: number
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  created_at: string
  items: {
    productId: string
    name: string
    price: number
    quantity: number
    image: string
  }[]
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadOrders()
    }
  }, [user, authLoading, router])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/orders')
      setOrders(response.data)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReorder = async (orderId: string) => {
    try {
      await api.post(`/orders/${orderId}/reorder`)
      alert('Order placed successfully!')
      loadOrders()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reorder')
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return

    try {
      await api.post(`/orders/${orderId}/cancel`)
      alert('Order cancelled successfully')
      loadOrders()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel order')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      failed: 'bg-blue-100 text-blue-800 border-blue-300',
      refunded: 'bg-gray-100 text-gray-800 border-gray-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.order_status === filter
  })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 mb-4 inline-block text-sm sm:text-base">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order History</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">View and manage your orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <FaFilter className="text-gray-500" />
            <button
              onClick={() => setFilter('all')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({orders.filter(o => o.order_status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'processing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Processing ({orders.filter(o => o.order_status === 'processing').length})
            </button>
            <button
              onClick={() => setFilter('shipped')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'shipped'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Shipped ({orders.filter(o => o.order_status === 'shipped').length})
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'delivered'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Delivered ({orders.filter(o => o.order_status === 'delivered').length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaBox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h3>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        Order #{order.order_number || order.id.substring(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.order_status)}`}>
                        {order.order_status.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.payment_status)}`}>
                        Payment: {order.payment_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × LKR {item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            LKR {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">LKR {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Tax (8%):</span>
                      <span className="text-gray-900">LKR {order.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="text-gray-900">
                        {order.shipping_fee === 0 ? 'FREE' : `LKR ${order.shipping_fee.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-orange-600">LKR {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex gap-3 flex-wrap">
                    <Link
                      href={`/order-confirmation/${order.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors"
                    >
                      <FaEye />
                      View Details
                    </Link>
                    <button
                      onClick={() => handleReorder(order.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                    >
                      <FaRedo />
                      Reorder
                    </button>
                    {['pending', 'processing'].includes(order.order_status) && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                      >
                        <FaTimes />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
