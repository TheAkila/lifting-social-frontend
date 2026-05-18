'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function MockPaymentPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Get order ID from parent checkout page via URL or session
    const urlParams = new URLSearchParams(window.location.search)
    const orderIdFromUrl = urlParams.get('order_id')
    
    if (orderIdFromUrl) {
      setOrderId(orderIdFromUrl)
    } else {
      // Try to get from session storage if it was stored by checkout page
      const storedOrderId = sessionStorage.getItem('mockOrderId')
      if (storedOrderId) {
        setOrderId(storedOrderId)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted || !orderId) return

    // Simulate payment processing
    const processPayment = async () => {
      try {
        // Wait 3 seconds to simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Simulate successful payment (90% success rate for testing)
        const isSuccess = Math.random() > 0.1
        
        if (isSuccess) {
          setStatus('success')
          // Redirect to payment callback with success status
          await new Promise(resolve => setTimeout(resolve, 1500))
          router.push(`/payment-callback?order_id=${orderId}&status_code=2`)
        } else {
          setStatus('error')
          // Show error for 3 seconds, then allow retry
          await new Promise(resolve => setTimeout(resolve, 3000))
          router.push('/checkout')
        }
      } catch (error) {
        console.error('Mock payment error:', error)
        setStatus('error')
      }
    }

    processPayment()
  }, [mounted, orderId, router])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        {/* PayHere Logo Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <div className="text-2xl">💳</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Mock Payment</h1>
          <p className="text-sm text-gray-600 mt-2">(Development/Testing Mode)</p>
        </div>

        {/* Order ID Display */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Order ID:</p>
            <p className="font-mono text-sm font-semibold text-gray-800">{orderId}</p>
          </div>
        )}

        {/* Status Content */}
        {status === 'processing' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Payment</h2>
              <p className="text-gray-600 text-sm">Please wait while we process your payment...</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> This is a mock payment in development mode. Your card will not be charged.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 text-sm">Your order has been confirmed. Redirecting...</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-800">
                Redirecting to confirmation page...
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-red-600 mb-2">Payment Failed</h2>
              <p className="text-gray-600 text-sm">The test payment simulation resulted in a failure.</p>
            </div>
            <Link
              href="/checkout"
              className="block bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Return to Checkout
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Mock Payment Page • Development Testing Only
          </p>
        </div>
      </div>
    </div>
  )
}
