'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Package, Calendar, Truck, CheckCircle2, Clock, Eye, Download, X, Plus } from 'lucide-react'
import Link from 'next/link'

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  id: string
  order_number: string
  created_at: string
  total: number
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  shipping_address?: {
    name?: string
    address?: string
    city?: string
    country?: string
  }
  billing_address?: {
    name?: string
    address?: string
    city?: string
    country?: string
  }
  payment_method?: string
}

const statusConfig = {
  pending: { color: 'bg-yellow-100', textColor: 'text-yellow-800', label: 'Pending', icon: Clock },
  processing: { color: 'bg-blue-100', textColor: 'text-blue-800', label: 'Processing', icon: Clock },
  shipped: { color: 'bg-purple-100', textColor: 'text-purple-800', label: 'Shipped', icon: Truck },
  delivered: { color: 'bg-green-100', textColor: 'text-green-800', label: 'Delivered', icon: CheckCircle2 },
  cancelled: { color: 'bg-red-100', textColor: 'text-red-800', label: 'Cancelled', icon: X },
}

export default function OrderTracking() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/orders')
      
      // Filter out delivered and cancelled orders from main view
      const activeOrders = response.data.filter(
        (order: Order) => order.order_status !== 'delivered' && order.order_status !== 'cancelled'
      )
      
      // Sort by date (newest first)
      const sorted = activeOrders.sort((a: Order, b: Order) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      
      setOrders(sorted)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Failed to load orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowDetails(true)
  }

  const generateInvoiceHTML = (order: Order) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${order.order_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .invoice-container { max-width: 900px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
          .invoice-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .invoice-title { font-size: 28px; font-weight: bold; margin: 0; }
          .invoice-subtitle { color: #666; font-size: 14px; }
          .order-info { display: flex; justify-content: space-between; margin: 20px 0; }
          .info-block { flex: 1; }
          .info-block label { font-weight: bold; color: #333; }
          .info-block p { margin: 5px 0; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #333; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          .totals { display: flex; justify-content: flex-end; margin: 20px 0; }
          .totals-box { width: 300px; }
          .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .totals-row.total { font-weight: bold; font-size: 16px; border-top: 2px solid #333; padding-top: 10px; }
          .status-badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .status-pending { background-color: #fef3c7; color: #92400e; }
          .status-processing { background-color: #dbeafe; color: #1e3a8a; }
          .status-shipped { background-color: #e9d5ff; color: #5b21b6; }
          .status-delivered { background-color: #dcfce7; color: #15803d; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <h1 class="invoice-title">Invoice</h1>
            <p class="invoice-subtitle">Order #${order.order_number}</p>
          </div>

          <div class="order-info">
            <div class="info-block">
              <label>Order Date:</label>
              <p>${new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div class="info-block">
              <label>Status:</label>
              <p>
                <span class="status-badge status-${order.order_status}">
                  ${statusConfig[order.order_status].label}
                </span>
              </p>
            </div>
          </div>

          ${order.shipping_address ? `
            <div class="order-info">
              <div class="info-block">
                <label>Shipping Address:</label>
                <p>${order.shipping_address.name || ''}</p>
                <p>${order.shipping_address.address || ''}</p>
                <p>${order.shipping_address.city || ''}, ${order.shipping_address.country || ''}</p>
              </div>
              ${order.billing_address ? `
                <div class="info-block">
                  <label>Billing Address:</label>
                  <p>${order.billing_address.name || ''}</p>
                  <p>${order.billing_address.address || ''}</p>
                  <p>${order.billing_address.city || ''}, ${order.billing_address.country || ''}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>Rs. ${item.price.toFixed(2)}</td>
                  <td>Rs. ${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-box">
              <div class="totals-row">
                <span>Subtotal:</span>
                <span>Rs. ${(order.total * 0.95).toFixed(2)}</span>
              </div>
              <div class="totals-row">
                <span>Shipping:</span>
                <span>Rs. 0.00</span>
              </div>
              <div class="totals-row total">
                <span>Total:</span>
                <span>Rs. ${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>For support, please contact us at support@lifting-social.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  if (loading) {
    return null
  }

  // Return null if no orders to hide the section completely
  if (orders.length === 0) {
    return null
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            My Orders
          </h2>
          <Link href="/shop" className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline transition">
            Shop More
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-2">No active orders</p>
            <p className="text-gray-500 text-sm mb-6">Delivered orders are hidden from this view</p>
            <Link href="/shop">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm">
                <Plus className="w-4 h-4" />
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.order_status].icon
              const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

              return (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition hover:border-gray-300">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900 truncate">#{order.order_number}</h3>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusConfig[order.order_status].color} ${statusConfig[order.order_status].textColor}`}>
                          {statusConfig[order.order_status].label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900">Rs. {order.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                    </div>
                  </div>

                  {/* Product Preview - Compact */}
                  <div className="mb-4 pb-4 border-t border-gray-100">
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-200"></div>
                            )}
                          </div>
                          <div className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {item.quantity}
                          </div>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-gray-600">+{order.items.length - 4}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions - Compact */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium text-sm flex items-center justify-center gap-1"
                    >
                      <span className="hidden sm:inline">Details</span>
                      <span className="sm:hidden text-sm">View</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 z-10 rounded-t-xl">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 transition p-1"
                title="Close order details"
                aria-label="Close order details"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-3 sm:p-4 space-y-3">
              {/* Order Info Cards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-600 font-medium mb-0.5">Order Number</p>
                  <p className="font-bold text-gray-900 text-xs">{selectedOrder.order_number}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-600 font-medium mb-0.5">Order Date</p>
                  <p className="font-bold text-gray-900 text-xs">
                    {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-600 font-medium mb-0.5">Status</p>
                  <p className={`font-semibold inline-block px-1.5 py-0.5 rounded text-xs ${statusConfig[selectedOrder.order_status].color} ${statusConfig[selectedOrder.order_status].textColor}`}>
                    {statusConfig[selectedOrder.order_status].label}
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-600 font-medium mb-0.5">Total Amount</p>
                  <p className="font-bold text-gray-900 text-xs">Rs. {selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Items Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-xs">Items Ordered</h3>
                <div className="space-y-1">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start p-2 bg-gray-50 rounded">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-xs truncate">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900 text-xs ml-2 flex-shrink-0">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Addresses */}
              {selectedOrder.shipping_address && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-xs">
                    Shipping Address
                  </h3>
                  <p className="text-gray-700 text-xs whitespace-pre-line bg-gray-50 p-2 rounded">
                    {selectedOrder.shipping_address.name && `${selectedOrder.shipping_address.name}\n`}
                    {selectedOrder.shipping_address.address}
                    {selectedOrder.shipping_address.city && `\n${selectedOrder.shipping_address.city}`}
                    {selectedOrder.shipping_address.country && `, ${selectedOrder.shipping_address.country}`}
                  </p>
                </div>
              )}

              {/* Payment Method */}
              {selectedOrder.payment_method && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-xs">Payment Method</h3>
                  <p className="text-gray-700 text-xs capitalize bg-gray-50 p-2 rounded">{selectedOrder.payment_method}</p>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => setShowDetails(false)}
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition font-medium text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
