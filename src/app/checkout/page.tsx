'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { FaArrowLeft, FaLock } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Redirect if cart is empty
  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const subtotal = totalPrice
  const tax = subtotal * 0.08
  const shipping = subtotal >= 5000 ? 0 : 500
  const total = subtotal + tax + shipping

  const [formData, setFormData] = useState({
    // Shipping Address
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    
    // Payment
    paymentMethod: 'card',
    
    // Notes
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Get auth token
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to complete your order')
        router.push('/login?redirect=/checkout')
        return
      }

      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
        billingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      }

      // Create order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create order')
      }

      const { order } = await response.json()

      // Clear cart
      clearCart()

      // Redirect to confirmation page
      router.push(`/order-confirmation/${order.id}`)
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(error.message || 'Failed to complete order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/cart" 
            className="inline-flex items-center text-gray-600 hover:text-black mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-black">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-black rounded-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4 text-black">Shipping Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border-2 ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition-colors`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-black">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition-colors`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-black">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition-colors`}
                        placeholder="+94 77 123 4567"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border-2 ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition-colors`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-black">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border-2 ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition-colors`}
                        placeholder="Colombo"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-black">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border-2 ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition-colors`}
                        placeholder="10100"
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border-2 border-black rounded-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4 text-black">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-black transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <span className="font-semibold">Credit/Debit Card</span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-black transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <span className="font-semibold">Cash on Delivery</span>
                  </label>
                </div>
              </motion.div>

              {/* Order Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border-2 border-black rounded-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4 text-black">Order Notes (Optional)</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="Any special instructions for your order..."
                />
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border-2 border-black rounded-lg p-6 sticky top-24"
              >
                <h2 className="text-xl font-bold mb-4 text-black">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-4 pb-4 border-b-2 border-gray-200">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded border-2 border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-black truncate">{item.name}</p>
                        <p className="text-xs text-gray-600">Size: {item.size}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-black">LKR {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>LKR {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (8%)</span>
                    <span>LKR {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `LKR ${shipping.toFixed(2)}`}</span>
                  </div>
                  {subtotal < 5000 && (
                    <p className="text-xs text-gray-500 italic">
                      Free shipping on orders over LKR 5,000
                    </p>
                  )}
                  <div className="flex justify-between text-xl font-bold text-black pt-3 border-t-2 border-black">
                    <span>Total</span>
                    <span>LKR {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      <FaLock className="text-sm" />
                      Place Order
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Your payment information is secure and encrypted
                </p>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
