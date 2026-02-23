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
    <section className="bg-white py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
         
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-zinc-900 mb-2 sm:mb-3">
            Bundle Offers & Combos
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-zinc-600 max-w-2xl mx-auto px-2">
            Save big on bundled packages - complete gear solutions at special prices
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
          {products.map((product, index) => (
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

                    {/* Bundle Badge */}
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                      <span className="text-white px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg" style={{ backgroundColor: '#D00000' }}>
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
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-1.5 sm:py-2 rounded-[6px] text-xs sm:text-sm font-bold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Bundle Offers Link */}
        <div className="text-center">
          <Link
            href="/shop?filter=bundles"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-white font-bold text-sm sm:text-base rounded-md transition-colors shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#D00000' }}
          >
            View All Bundles →
          </Link>
        </div>
      </div>
    </section>
  )
}
