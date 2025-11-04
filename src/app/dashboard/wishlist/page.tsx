'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import api from '@/lib/api'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa'

interface Product {
  _id: string
  name: string
  price: number
  image: string
  category: string
  inStock: boolean
}

export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { addItem } = useCart()
  const router = useRouter()
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadWishlist()
    }
  }, [user, authLoading, router])

  const loadWishlist = async () => {
    try {
      setLoading(true)
      const response = await api.get('/profile/wishlist')
      setWishlist(response.data)
    } catch (error) {
      console.error('Error loading wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await api.post('/profile/wishlist', { productId })
      setWishlist(wishlist.filter(p => p._id !== productId))
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      alert('Failed to remove from wishlist')
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: 'Standard' // Default size for products without size variants
    })
    alert(`${product.name} added to cart!`)
  }

    const handleMoveToCart = async (product: Product) => {
    handleAddToCart(product)
    await handleRemoveFromWishlist(product._id)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark pt-28 pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-orange-600 hover:text-orange-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="mt-2 text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {/* Wishlist Grid */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save items you love to buy them later</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.image || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <FaHeart className="text-red-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-gray-900 mt-1 mb-2">{product.name}</h3>
                  <p className="text-xl font-bold text-orange-600 mb-4">
                    LKR {product.price.toLocaleString()}
                  </p>

                  {/* Actions */}
                  <div className="space-y-2">
                    {product.inStock ? (
                      <>
                        <button
                          onClick={() => handleMoveToCart(product)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors"
                        >
                          <FaShoppingCart />
                          Move to Cart
                        </button>
                        <Link
                          href={`/shop/${product._id}`}
                          className="block w-full text-center px-4 py-2 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 font-semibold transition-colors"
                        >
                          View Details
                        </Link>
                      </>
                    ) : (
                      <button
                        disabled
                        className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-semibold"
                      >
                        Out of Stock
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold transition-colors"
                    >
                      <FaTrash />
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {wishlist.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => {
                  wishlist.filter(p => p.inStock).forEach(p => handleAddToCart(p))
                }}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors"
              >
                Add All to Cart
              </button>
              <Link
                href="/shop"
                className="px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 font-semibold transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
