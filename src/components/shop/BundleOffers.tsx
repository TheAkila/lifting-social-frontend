'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import api from '@/lib/api'
import { useCart } from '@/contexts/CartContext'

export default function BundleOffers() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  const fetchBundleProducts = () => {
    api
      .get(`/products?t=${Date.now()}`)
      .then((res) => {
        // Filter products marked as bundle offers
        const bundles = res.data.filter((p: any) => p.bundleOffer === true)
        setProducts(bundles.slice(0, 6)) // Show max 6 bundle products
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch bundle products', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchBundleProducts()
  }, [])

  // Refetch when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchBundleProducts()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const handleQuickAdd = (product: any) => {
    addItem({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: product.sizes?.[0] || '',
      color: product.colors?.[0] || '',
      image: product.image,
      shippingType: product.shippingType || 'free',
      shippingAmount: product.shippingAmount || 0,
    })
  }

  if (loading || products.length === 0) {
    return null
  }

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 bg-white/20 backdrop-blur-sm">
            ✨ Bundle Offers
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-2 sm:mb-3">
            Bundle Offers & Combos
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-2xl mx-auto px-2">
            Complete your training with bundled essentials at special prices
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
          {products.map((product, index) => {
            const hasDiscount = product.comparePrice && product.comparePrice > product.price
            const discountPercent = hasDiscount 
              ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
              : 0
            
            return (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="group bg-white rounded-lg sm:rounded-[12px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-350 hover:-translate-y-1 h-full">
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
                          <span className="text-white font-display font-semibold text-sm sm:text-lg text-center px-4">
                            {product.name}
                          </span>
                        </div>
                      )}

                      {/* Discount Badge */}
                      {discountPercent > 0 && (
                        <div className="absolute top-0 right-0">
                          <div className="text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-bl-lg sm:rounded-bl-[8px] shadow-xl bg-purple-600">
                            <div className="text-base sm:text-xl font-black leading-none mb-0.5">{discountPercent}%</div>
                            <div className="text-[9px] sm:text-xs font-bold uppercase tracking-wide">OFF</div>
                          </div>
                        </div>
                      )}

                      {/* Bundle Badge */}
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                        <span className="bg-blue-400 text-white px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg">
                          Bundle
                        </span>
                      </div>

                      {/* Quick Add */}
                      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleQuickAdd(product)
                          }}
                          disabled={product.inStock === false}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1.5 sm:py-2 rounded-[6px] text-xs sm:text-sm font-bold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <Link href={`/shop/product/${product._id || product.id}`} className="block p-2.5 sm:p-3 bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        {product.category}
                      </span>
                      {product.shippingType === 'free' && (
                        <span className="font-display text-red-600 font-semibold text-xs">
                          Free Delivery
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-semibold text-xs sm:text-sm text-zinc-900 mt-0.5 sm:mt-1 mb-1 sm:mb-1.5 line-clamp-2 group-hover:text-zinc-700 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className="font-display font-bold text-xs sm:text-sm text-zinc-900">
                        LKR {product.price?.toLocaleString()}
                      </span>
                      {product.comparePrice && (
                        <span className="text-zinc-400 text-[10px] sm:text-xs line-through">
                          LKR {product.comparePrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* View All Bundles Link */}
        <div className="text-center">
          <Link
            href="/shop?filter=bundles"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-white font-bold text-sm sm:text-base rounded-md transition-all shadow-lg hover:shadow-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm"
          >
            <span>View All Bundle Offers</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
