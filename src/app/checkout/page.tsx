'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { FaArrowLeft, FaLock } from 'react-icons/fa'
import { motion } from 'framer-motion'

export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  const { items, totalPrice, totalShipping, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    // Delivery Information
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    saveInfo: false,
    
    // Shipping Method
    shippingMethod: 'standard',
    
    // Payment
    paymentMethod: 'card',
    
    // Notes
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  // Force re-render when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Trigger a state update to force re-render
        window.dispatchEvent(new Event('cartUpdate'))
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])
  
  // Redirect if cart is empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart')
    }
  }, [mounted, items.length, router])

  if (!mounted || items.length === 0) {
    return null
  }

  const subtotal = totalPrice
  const shipping = totalShipping
  const total = subtotal + shipping

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'

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
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
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
          fullName: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode || '',
          phone: formData.phone,
        },
        billingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode || '',
          phone: formData.phone,
        },
        shippingMethod: formData.shippingMethod,
        shippingCost: shipping,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      }

      // Create order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
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

      // For card payment, initiate PayHere payment
      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: order.id }),
      })

      if (!paymentResponse.ok) {
        throw new Error('Failed to initiate payment')
      }

      const { paymentData, paymentUrl, isMockMode } = await paymentResponse.json()

      console.log('[Checkout Debug] Payment Data received:', paymentData)
      console.log('[Checkout Debug] Payment URL:', paymentUrl)
      console.log('[Checkout Debug] Mock Mode:', isMockMode)

      // Handle mock payment mode (development/testing without real PayHere credentials)
      if (isMockMode) {
        console.log('[Checkout Debug] Redirecting to mock payment page')
        // Store order ID in session for mock payment page
        sessionStorage.setItem('mockOrderId', order.id)
        // Redirect to mock payment page
        router.push(`/mock-payment?order_id=${order.id}`)
        return
      }

      // Submit payment form to PayHere (real payment)
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = paymentUrl

      Object.keys(paymentData).forEach(key => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = paymentData[key]
        form.appendChild(input)
      })

      console.log('[Checkout Debug] Form fields:', Array.from(form.elements).map(el => ({
        name: (el as any).name,
        value: (el as any).value
      })))

      document.body.appendChild(form)
      console.log('[Checkout Debug] Submitting form to PayHere...')
      form.submit()
    } catch (error: any) {
      console.error('Checkout error:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to complete order. Please try again.'
      alert(errorMessage)
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
              {/* Delivery Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-300 shadow-sm rounded-lg p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Delivery Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-black">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition-colors`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-black">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition-colors`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">
                      Phone
                    </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition-colors`}
                        placeholder="+94 77 123 4567"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition-colors`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-black">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition-colors`}
                        placeholder="Colombo"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-black">
                        Postal Code (Optional)
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-black transition-colors`}
                        placeholder="10100"
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  {/* Save Information Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label className="text-sm text-black">
                      Save this information for next time
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-gray-300 shadow-sm rounded-lg p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Shipping Method</h2>
                
                <div className="space-y-2 sm:space-y-3">
                  <label className="flex items-center justify-between p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-black transition-colors">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={formData.shippingMethod === 'standard'}
                        onChange={handleChange}
                        className="mr-2 sm:mr-3"
                      />
                      <div>
                        <span className="text-sm sm:text-base font-semibold">Standard Delivery</span>
                        <p className="text-xs text-gray-600">3-5 business days</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{shipping === 0 ? 'FREE' : `LKR ${shipping.toLocaleString()}`}</span>
                  </label>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-gray-300 shadow-sm rounded-lg p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Payment Method</h2>
                
                <div className="space-y-2 sm:space-y-3">
                  <label className="flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-black transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="mr-2 sm:mr-3"
                    />
                    <div>
                      <span className="text-sm sm:text-base font-semibold">Credit / Debit Card Payments using PayHere</span>
                      <p className="text-xs text-gray-600 mt-1">Secure payment processing via PayHere gateway</p>
                    </div>
                  </label>
                </div>
              </motion.div>

              {/* Order Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-gray-300 shadow-sm rounded-lg p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Order Notes (Optional)</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="Any special instructions for your order..."
                />
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-gray-300 shadow-sm rounded-lg p-4 sm:p-6 lg:sticky lg:top-24"
              >
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b-2 border-gray-200">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color || ''}`} className="flex items-center gap-2 sm:gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-black truncate">{item.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-600">Size: {item.size}</p>
                        <p className="text-[10px] sm:text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-black">LKR {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `LKR ${shipping.toLocaleString()}`}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-black">
                      <span>Total</span>
                      <span>LKR {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-black text-white rounded-lg font-bold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                <p className="text-xs text-gray-500 text-center mt-2">
                  By placing an order, you agree to our{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms & Conditions
                  </Link>
                  ,{' '}
                  <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  , and{' '}
                  <Link href="/refund-policy" className="text-blue-600 hover:underline">
                    Refund Policy
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
