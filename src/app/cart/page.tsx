'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { FaTrash, FaShoppingBag, FaMinus, FaPlus } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    // TODO: Implement checkout flow
    alert('Checkout functionality coming soon!')
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 text-black">Shopping Cart</h1>
          <p className="text-gray-600">
            {totalItems === 0 ? 'Your cart is empty' : `${totalItems} item${totalItems === 1 ? '' : 's'} in your cart`}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white border-2 border-black rounded-lg p-6 sm:p-8 text-center py-12 sm:py-16">
            <FaShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-black">Your cart is empty</h2>
            <p className="text-gray-600 mb-6 sm:mb-8">Add some products to get started!</p>
            <Link href="/shop" className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors">
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border-2 border-black rounded-lg p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg border-2 border-gray-200"
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1 text-black">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">Size: {item.size}</p>
                      {item.color && (
                        <p className="text-sm text-gray-600 mb-2">Color: {item.color}</p>
                      )}
                      <p className="text-black font-bold">LKR {item.price.toLocaleString()}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-2">
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-blue-600 hover:text-blue-700 transition-colors p-2 order-last sm:order-first"
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>

                      <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="text-black hover:text-gray-700 transition-colors p-1"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                        <span className="font-bold w-8 text-center text-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="text-black hover:text-gray-700 transition-colors p-1"
                        >
                          <FaPlus className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="font-bold text-lg text-black">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="w-full py-3 px-6 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors border-2 border-blue-600"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-black rounded-lg p-4 sm:p-6 sticky top-20 sm:top-28">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>LKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>LKR {(totalPrice * 0.08).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{totalPrice >= 5000 ? 'FREE' : 'LKR 500'}</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3">
                    <div className="flex justify-between text-xl font-bold text-black">
                      <span>Total</span>
                      <span className="text-black">
                        LKR {(totalPrice + (totalPrice * 0.08) + (totalPrice >= 5000 ? 0 : 500)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 px-6 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  <Link
                    href="/shop"
                    className="block w-full text-center py-3 px-6 border-2 border-black text-black hover:bg-gray-50 rounded-lg font-semibold transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Free Shipping Notice */}
                {totalPrice < 5000 && (
                  <div className="mt-6 p-4 bg-gray-100 border-2 border-black rounded-lg">
                    <p className="text-sm text-black">
                      Add <strong>LKR {(5000 - totalPrice).toLocaleString()}</strong> more to get FREE shipping!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
