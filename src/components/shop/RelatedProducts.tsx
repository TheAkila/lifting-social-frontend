'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import api from '@/lib/api'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string
  _id?: string
  name: string
  price: number
  compare_price?: number
  image: string
  category: string
  in_stock: boolean
  sizes?: string[]
  colors?: string[]
  shipping_type?: 'free' | 'paid'
  shipping_amount?: number
}

interface RelatedProductsProps {
  productId: string
  limit?: number
}

export default function RelatedProducts({ productId, limit = 6 }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  useEffect(() => {
    fetchRelatedProducts()
  }, [productId])

  // Refetch when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchRelatedProducts()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [productId])

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/products/${productId}/related?limit=${limit}&t=${Date.now()}`)
      setProducts(res.data)
    } catch (error) {
      console.error('Error fetching related products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 320
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount)

    container.scrollTo({ left: newPosition, behavior: 'smooth' })
    setScrollPosition(newPosition)
  }

  const handleQuickAdd = (product: Product) => {
    addItem({
      id: product.id || product._id || '',
      name: product.name,
      price: product.price,
      quantity: 1,
      size: product.sizes?.[0] || '',
      color: product.colors?.[0] || '',
      image: product.image,
      shippingType: product.shipping_type || 'free',
      shippingAmount: product.shipping_amount || 0,
    })
  }

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900">
            You May Also Like
          </h2>
          <p className="text-zinc-600 mt-1">Similar products you might be interested in</p>
        </div>

        {/* Desktop Navigation */}
        {products.length > 3 && (
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              disabled={scrollPosition === 0}
              className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Scroll left"
            >
              <span className="text-lg">←</span>
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-all"
              aria-label="Scroll right"
            >
              <span className="text-lg">→</span>
            </button>
          </div>
        )}
      </div>

      {/* Products Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, index) => {
          const productId = product.id || product._id || ''
          const hasDiscount = product.compare_price && product.compare_price > product.price
          const discountPercent = hasDiscount 
            ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
            : 0

          return (
            <motion.div
              key={productId}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start"
            >
              <div className="group bg-white rounded-[12px] overflow-hidden border border-zinc-100 shadow-soft hover:shadow-card-hover transition-all duration-350 hover:-translate-y-1 h-full">
                {/* Product Image */}
                <Link href={`/shop/product/${productId}`}>
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
                    {hasDiscount && (
                      <div className="absolute top-3 right-3">
                        <span className="text-white px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#D00000' }}>
                          {discountPercent}% OFF
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
                        disabled={!product.in_stock}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-[8px] text-sm font-medium flex items-center justify-center gap-2 shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>{product.in_stock ? 'Quick Add' : 'Out of Stock'}</span>
                      </button>
                    </div>

                    {/* Out of Stock Overlay */}
                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-zinc-900/70 flex items-center justify-center">
                        <span className="text-white text-sm font-medium px-3 py-1.5 bg-zinc-800 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <Link href={`/shop/product/${productId}`} className="block p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      {product.category}
                    </span>
                    {product.shipping_type === 'free' && (
                      <span className="font-display text-red-600 font-semibold text-sm">
                        Free Delivery
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-semibold text-base text-zinc-900 mt-1 mb-2 line-clamp-2 group-hover:text-brand-accent transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-lg text-zinc-900">
                      LKR {product.price?.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-zinc-400 text-sm line-through">
                        LKR {product.compare_price!.toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* View All Link */}
      <div className="text-center mt-8">
        <Link 
          href={`/shop?category=${products[0]?.category}`}
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
        >
          <span>View all {products[0]?.category} products</span>
          <span>→</span>
        </Link>
      </div>
    </section>
  )
}
