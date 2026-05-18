'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaCheckCircle, FaBox, FaTruck, FaEnvelope } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'

interface Order {
  id: string
  order_number: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
    image: string
    size?: string
    color?: string
  }>
  subtotal: number
  tax: number
  shipping_fee: number
  total: number
  shipping_address: {
    fullName: string
    address: string
    city: string
    postalCode: string
    phone: string
  }
  payment_method: string
  payment_status: string
  order_status: string
  created_at: string
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [params.orderId])

  useEffect(() => {
    if (order) {
      clearCart()
    }
  }, [order, clearCart])

  const fetchOrder = async () => {
    try {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${params.orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch order')
      }

      const data = await response.json()
      setOrder(data)
    } catch (err: any) {
      console.error('Error fetching order:', err)
      setError(err.message || 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4">Order Not Found</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{error || 'Unable to load order details'}</p>
            <Link 
              href="/shop" 
              className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-black text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-8"
          >
            <FaCheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-3 sm:mb-4" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-2 text-black">
              Order Confirmed!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-2">
              Thank you for your order. We'll send you an email confirmation shortly.
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Order Number: <span className="font-mono font-semibold text-black">{order.order_number}</span>
            </p>
          </motion.div>

          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border-2 border-black rounded-lg p-4 sm:p-6 mb-4 sm:mb-6"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Order Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <FaBox className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-semibold text-black">Order Placed</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaTruck className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-400">Shipping</p>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-400">Delivered</p>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border-2 border-black rounded-lg p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b-2 border-gray-200 last:border-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-black">{item.name}</h3>
                        {item.size && (
                          <p className="text-sm text-gray-600">Size: {item.size}</p>
                        )}
                        {item.color && (
                          <p className="text-sm text-gray-600">Color: {item.color}</p>
                        )}
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-black">
                          LKR {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          LKR {item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border-2 border-black rounded-lg p-4 sm:p-6 mt-4 sm:mt-6"
              >
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Shipping Address</h2>
                <div className="text-sm sm:text-base text-gray-700">
                  <p className="font-semibold text-black">{order.shipping_address.fullName}</p>
                  <p>{order.shipping_address.address}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.postalCode}</p>
                  <p className="mt-2">Phone: {order.shipping_address.phone}</p>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border-2 border-black rounded-lg p-4 sm:p-6 lg:sticky lg:top-24"
              >
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Order Summary</h2>
                
                <div className="space-y-2 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base text-gray-700">
                    <span>Subtotal</span>
                    <span>LKR {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-gray-700">
                    <span>Tax</span>
                    <span>LKR {order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-gray-700">
                    <span>Shipping</span>
                    <span>
                      {order.shipping_fee === 0 ? 'FREE' : `LKR ${order.shipping_fee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-black pt-2 sm:pt-3 border-t-2 border-black">
                    <span>Total</span>
                    <span>LKR {order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b-2 border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="text-sm sm:text-base font-semibold text-black capitalize">
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Link
                    href="/profile/orders"
                    className="block w-full py-2.5 sm:py-3 bg-black text-white text-center rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-900 transition-colors"
                  >
                    View My Orders
                  </Link>
                  <Link
                    href="/shop"
                    className="block w-full py-2.5 sm:py-3 bg-white text-black text-center border-2 border-black rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
