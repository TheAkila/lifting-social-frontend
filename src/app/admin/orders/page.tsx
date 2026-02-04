'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  FaShoppingCart, 
  FaFilter, 
  FaSearch, 
  FaEye, 
  FaTimes,
  FaTruck,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBox
} from 'react-icons/fa'

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  order_number: string
  user_id: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping_fee: number
  total: number
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed'
  payment_method: string
  shipping_address: any
  billing_address: any
  tracking_number?: string
  notes?: string
  created_at: string
  updated_at: string
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Form states for order update
  const [newStatus, setNewStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchOrders()
    }
  }, [user])

  useEffect(() => {
    // Apply filters
    let filtered = [...orders]

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.order_status === statusFilter)
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.payment_status === paymentFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user_id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
  }, [orders, statusFilter, paymentFilter, searchQuery])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
        setFilteredOrders(data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.order_status)
    setTrackingNumber(order.tracking_number || '')
    setShowOrderModal(true)
  }

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return

    setUpdating(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${selectedOrder.id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            orderStatus: newStatus,
            trackingNumber: trackingNumber || undefined
          })
        }
      )

      if (response.ok) {
        await fetchOrders()
        setShowOrderModal(false)
        setSelectedOrder(null)
      } else {
        alert('Failed to update order')
      }
    } catch (error) {
      console.error('Failed to update order:', error)
      alert('Failed to update order')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaClock />
      case 'processing': return <FaBox />
      case 'shipped': return <FaTruck />
      case 'delivered': return <FaCheckCircle />
      case 'cancelled': return <FaTimesCircle />
      default: return <FaClock />
    }
  }

  const calculateTotalRevenue = () => {
    return orders
      .filter(order => order.payment_status === 'paid')
      .reduce((sum, order) => sum + order.total, 0)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
            <p className="text-gray-600">Manage and track customer orders</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-[10px] hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-[12px] p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-[10px] flex items-center justify-center">
                <FaShoppingCart className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[12px] p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  LKR {calculateTotalRevenue().toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-[10px] flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[12px] p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.order_status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-[10px] flex items-center justify-center">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[12px] p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.order_status === 'delivered').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-[10px] flex items-center justify-center">
                <FaTruck className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[12px] p-6 mb-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <span className="text-gray-700 font-medium">Filters:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-[8px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-[8px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Payment</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number or user ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FaShoppingCart className="text-4xl mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {order.user_id.substring(0, 8)}...
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          LKR {order.total.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                          {getStatusIcon(order.order_status)}
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleOrderClick(order)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-[8px] hover:bg-blue-700 transition-colors"
                        >
                          <FaEye />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[16px] max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-[16px]">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="text-lg font-semibold text-blue-600">{selectedOrder.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedOrder.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                    {selectedOrder.payment_status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="border border-gray-200 rounded-[12px] overflow-hidden">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-[8px]"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-6 bg-gray-50 rounded-[12px] p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>LKR {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax:</span>
                    <span>LKR {selectedOrder.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span>LKR {selectedOrder.shipping_fee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
                    <span>Total:</span>
                    <span>LKR {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 rounded-[12px] p-4">
                    <p className="text-gray-700">{selectedOrder.shipping_address.fullName}</p>
                    <p className="text-gray-700">{selectedOrder.shipping_address.address}</p>
                    <p className="text-gray-700">
                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postalCode}
                    </p>
                    <p className="text-gray-700">{selectedOrder.shipping_address.phone}</p>
                  </div>
                </div>
              )}

              {/* Update Order Status */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateOrder}
                      disabled={updating}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-[10px] hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {updating ? 'Updating...' : 'Update Order'}
                    </button>
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-[10px] hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
