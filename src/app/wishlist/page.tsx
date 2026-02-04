'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function WishlistPage() {
  const { items, loading, removeFromWishlist } = useWishlist()
  const { addItem } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login?redirect=/wishlist')
    }
  }, [user, loading, router])

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: product.sizes?.[0] || '',
      color: product.colors?.[0] || '',
      image: product.image
    })
  }

  const handleRemove = async (productId: string) => {
    setRemovingId(productId)
    await removeFromWishlist(productId)
    setRemovingId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Shop</span>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-600 fill-red-600" />
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-zinc-900">
              My Wishlist
            </h1>
          </div>
          <p className="text-zinc-600 mt-2">
            {items.length === 0 
              ? 'Your wishlist is empty' 
              : `${items.length} ${items.length === 1 ? 'item' : 'items'} saved`
            }
          </p>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 sm:py-20"
          >
            <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-zinc-400" />
            </div>
            <h2 className="font-display font-semibold text-2xl text-zinc-900 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-zinc-600 mb-8 max-w-md mx-auto">
              Start adding products you love to your wishlist and we'll save them for you
            </p>
            <Link 
              href="/shop"
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-[8px] font-medium transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Start Shopping</span>
            </Link>
          </motion.div>
        )}

        {/* Wishlist Grid */}
        {items.length > 0 && (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => {
                const product = item.products
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group bg-white rounded-[12px] overflow-hidden border border-zinc-100 shadow-soft hover:shadow-card-hover transition-all duration-350"
                  >
                    {/* Product Image */}
                    <Link href={`/shop/product/${product.id}`}>
                      <div className="relative aspect-square bg-zinc-100 overflow-hidden">
                        {product.image ? (
                          <div 
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                            style={{ backgroundImage: `url(${product.image})` }} 
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                            <span className="text-white font-display font-semibold text-lg text-center px-4">
                              {product.name}
                            </span>
                          </div>
                        )}

                        {/* Discount Badge */}
                        {product.compare_price && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                              {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                            </span>
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleRemove(product.id)
                          }}
                          disabled={removingId === product.id}
                          className="absolute top-3 left-3 w-9 h-9 rounded-[8px] bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-50 transition-all shadow-sm opacity-0 group-hover:opacity-100 disabled:opacity-50"
                          aria-label="Remove from wishlist"
                        >
                          {removingId === product.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-600" />
                          )}
                        </button>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link href={`/shop/product/${product.id}`} className="block mb-3">
                        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                          {product.category}
                        </span>
                        <h3 className="font-display font-semibold text-base text-zinc-900 mt-1 mb-2 line-clamp-2 group-hover:text-brand-accent transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-lg text-zinc-900">
                            LKR {product.price?.toLocaleString()}
                          </span>
                          {product.compare_price && (
                            <span className="text-zinc-400 text-sm line-through">
                              LKR {product.compare_price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.in_stock === false}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-[8px] text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{product.in_stock === false ? 'Out of Stock' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>
        )}

        {/* Continue Shopping */}
        {items.length > 0 && (
          <div className="text-center mt-12">
            <Link 
              href="/shop"
              className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Continue Shopping</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
