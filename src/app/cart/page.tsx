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
    <div className="min-h-screen bg-brand-dark pt-28 pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">Shopping Cart</h1>
          <p className="text-brand-light/70">
            {totalItems === 0 ? 'Your cart is empty' : `${totalItems} item${totalItems === 1 ? '' : 's'} in your cart`}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="card text-center py-16">
            <FaShoppingBag className="w-20 h-20 text-brand-light/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-brand-light/70 mb-8">Add some products to get started!</p>
            <Link href="/shop" className="btn-primary inline-block">
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-brand-light/70 mb-2">Size: {item.size}</p>
                      {item.color && (
                        <p className="text-sm text-brand-light/70 mb-2">Color: {item.color}</p>
                      )}
                      <p className="text-brand-accent font-bold">LKR {item.price.toLocaleString()}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2"
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>

                      <div className="flex items-center gap-2 bg-brand-light/10 rounded-lg px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="text-brand-light hover:text-brand-accent transition-colors p-1"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                        <span className="font-bold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="text-brand-light hover:text-brand-accent transition-colors p-1"
                        >
                          <FaPlus className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="font-bold text-lg">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="w-full py-3 px-6 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg font-semibold transition-colors border border-red-400/30"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-28">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-brand-light/70">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>LKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brand-light/70">
                    <span>Tax (8%)</span>
                    <span>LKR {(totalPrice * 0.08).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brand-light/70">
                    <span>Shipping</span>
                    <span>{totalPrice >= 5000 ? 'FREE' : 'LKR 500'}</span>
                  </div>
                  <div className="border-t border-brand-light/10 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-brand-accent">
                        LKR {(totalPrice + (totalPrice * 0.08) + (totalPrice >= 5000 ? 0 : 500)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="btn-primary w-full"
                  >
                    Proceed to Checkout
                  </button>
                  <Link
                    href="/shop"
                    className="block w-full text-center py-3 px-6 border-2 border-brand-accent text-brand-accent hover:bg-brand-accent/10 rounded-lg font-semibold transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Free Shipping Notice */}
                {totalPrice < 5000 && (
                  <div className="mt-6 p-4 bg-brand-accent/10 border border-brand-accent/30 rounded-lg">
                    <p className="text-sm text-brand-accent">
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
