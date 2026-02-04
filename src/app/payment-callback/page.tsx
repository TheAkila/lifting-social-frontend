'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa'
import Link from 'next/link'

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing')
  const [orderId, setOrderId] = useState<string>('')

  useEffect(() => {
    // Get payment parameters from URL
    const order_id = searchParams.get('order_id')
    const payment_id = searchParams.get('payment_id')
    const status_code = searchParams.get('status_code')

    if (!order_id) {
      setStatus('failed')
      return
    }

    setOrderId(order_id)

    // Check payment status
    // status_code: 2 = Success, 0 = Pending, -1 = Canceled, -2 = Failed
    if (status_code === '2') {
      setStatus('success')
      // Redirect to order confirmation after 3 seconds
      setTimeout(() => {
        router.push(`/order-confirmation/${order_id}`)
      }, 3000)
    } else {
      setStatus('failed')
    }
  }, [searchParams, router])

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold text-black mb-2">Processing Payment...</h1>
          <p className="text-gray-600">Please wait while we verify your payment</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <FaCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-black mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully. You will be redirected to your order details shortly.
          </p>
          <div className="space-y-3">
            <Link
              href={`/order-confirmation/${orderId}`}
              className="block w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              View Order Details
            </Link>
            <Link
              href="/shop"
              className="block w-full py-3 bg-white text-black border-2 border-black rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <FaTimesCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-black mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment could not be processed. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="block w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/cart"
            className="block w-full py-3 bg-white text-black border-2 border-black rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  )
}
