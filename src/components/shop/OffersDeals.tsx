'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import api from '@/lib/api'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'

export default function OffersDeals() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    api
      .get('/products')
      .then((res) => {
        // Filter products with discounts (comparePrice > price)
        const deals = res.data.filter((p: any) => p.comparePrice && p.comparePrice > p.price)
        setProducts(deals.slice(0, 6)) // Show max 6 deal products
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch deal products', err)
        setLoading(false)
      })
  }, [])

  const handleQuickAdd = (product: any) => {
    addItem({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: product.sizes?.[0] || '',
      color: product.colors?.[0] || '',
      image: product.image
    })
  }

  if (loading || products.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: '#D00000' }}>
            Limited Time Offers
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-zinc-900 mb-3">
            Deals & Discounts
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto">
            Save big on premium weightlifting gear - up to 50% off
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {products.map((product, index) => {
            const discount = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
            
            return (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="group bg-white rounded-[12px] overflow-hidden border-2 border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-350 hover:-translate-y-1 h-full">
                  {/* Product Image */}
                  <Link href={`/shop/product/${product._id || product.id}`}>
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

                      {/* Large Discount Badge */}
                      <div className="absolute top-0 right-0">
                        <div className="text-white px-4 py-2 rounded-bl-[12px] shadow-xl" style={{ backgroundColor: '#D00000' }}>
                          <div className="text-2xl font-black leading-none mb-1">{discount}%</div>
                          <div className="text-xs font-bold uppercase tracking-wide">OFF</div>
                        </div>
                      </div>

                      {/* Sale Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-yellow-400 text-zinc-900 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                          Sale
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <button 
                        onClick={async (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const productId = product._id || product.id
                          if (isInWishlist(productId)) {
                            await removeFromWishlist(productId)
                          } else {
                            await addToWishlist(productId)
                          }
                        }}
                        className="absolute bottom-3 right-3 w-9 h-9 rounded-[8px] bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 text-sm font-bold"
                        aria-label={isInWishlist(product._id || product.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        {isInWishlist(product._id || product.id) ? '❤️' : '🤍'}
                      </button>

                      {/* Quick Add */}
                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleQuickAdd(product)
                          }}
                          disabled={product.inStock === false}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-[8px] text-sm font-bold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Quick Add
                        </button>
                      </div>

                      {/* Out of Stock Overlay */}
                      {product.inStock === false && (
                        <div className="absolute inset-0 bg-zinc-900/70 flex items-center justify-center">
                          <span className="text-white text-sm font-medium px-3 py-1.5 bg-zinc-800 rounded-full">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <Link href={`/shop/product/${product._id || product.id}`} className="block p-4 bg-gradient-to-b from-white to-blue-50/30">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="font-display font-semibold text-base text-zinc-900 mt-1 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-display font-bold text-xl text-blue-600">
                        LKR {product.price?.toLocaleString()}
                      </span>
                      <span className="text-zinc-400 text-sm line-through">
                        LKR {product.comparePrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 font-semibold">
                      Save LKR {(product.comparePrice - product.price).toLocaleString()}
                    </div>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* View All Deals Link */}
        <div className="text-center">
          <Link
            href="/shop?filter=deals"
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-[8px] transition-colors shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#D00000' }}
          >
            View All Deals →
          </Link>
        </div>
      </div>
    </section>
  )
}
