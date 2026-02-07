'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import api from '@/lib/api'
import { useCart } from '@/contexts/CartContext'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const { addItem } = useCart()

  const fetchFeaturedProducts = () => {
    api
      .get(`/products?t=${Date.now()}`)
      .then((res) => {
        const featured = res.data.filter((p: any) => p.featured)
        setProducts(featured.slice(0, 8)) // Show max 8 featured products
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch featured products', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  // Refetch when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchFeaturedProducts()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('featured-scroll-container')
    if (!container) return

    const scrollAmount = 300
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount)

    container.scrollTo({ left: newPosition, behavior: 'smooth' })
    setScrollPosition(newPosition)
  }

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
    <section className="bg-white py-12 sm:py-16 lg:py-20 border-t border-zinc-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-zinc-900 mb-2">
              Featured Products
            </h2>
            <p className="text-sm sm:text-base text-zinc-600">
              Hand-picked essentials for serious lifters
            </p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="w-10 h-10 rounded-[8px] flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 transition-colors"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-10 h-10 rounded-[8px] flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 transition-colors"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>

        {/* Products Horizontal Scroll */}
        <div 
          id="featured-scroll-container"
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
            >
              <div className="group bg-white rounded-[12px] overflow-hidden border border-zinc-100 shadow-soft hover:shadow-card-hover transition-all duration-350 hover:-translate-y-1 h-full">
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

                    {/* Featured Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                        Featured
                      </span>
                    </div>

                    {/* Discount Badge */}
                    {product.comparePrice && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                          {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                        </span>
                      </div>
                    )}



                    {/* Quick Add */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleQuickAdd(product)
                        }}
                        disabled={product.inStock === false}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-[8px] text-sm font-medium shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                <Link href={`/shop/product/${product._id || product.id}`} className="block p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      {product.category}
                    </span>
                    {product.shippingType === 'free' && (
                      <span className="text-red-600 font-bold text-xs uppercase tracking-widest">
                        FREE delivery
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-semibold text-base text-zinc-900 mt-1 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-lg text-zinc-900">
                      LKR {product.price?.toLocaleString()}
                    </span>
                    {product.comparePrice && (
                      <span className="text-zinc-400 text-sm line-through">
                        LKR {product.comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            View All Products →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
