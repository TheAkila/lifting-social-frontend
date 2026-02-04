'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Eye } from 'lucide-react'
import api from '@/lib/api'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  image: string
  category: string
  in_stock: boolean
  sizes?: string[]
  colors?: string[]
}

const STORAGE_KEY = 'lifting_social_recently_viewed'
const MAX_ITEMS = 10

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    fetchRecentlyViewed()
  }, [])

  const fetchRecentlyViewed = async () => {
    try {
      setLoading(true)
      
      // Get recently viewed product IDs from localStorage
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        setLoading(false)
        return
      }

      const productIds: string[] = JSON.parse(stored)
      if (productIds.length === 0) {
        setLoading(false)
        return
      }

      // Fetch product details for all IDs
      const productPromises = productIds.map(id => 
        api.get(`/products/${id}`).catch(() => null)
      )
      
      const responses = await Promise.all(productPromises)
      const validProducts = responses
        .filter(res => res !== null && res.data)
        .map(res => res!.data)

      setProducts(validProducts)
    } catch (error) {
      console.error('Error fetching recently viewed:', error)
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
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: product.sizes?.[0] || '',
      color: product.colors?.[0] || '',
      image: product.image
    })
  }

  if (loading) {
    return null
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="bg-zinc-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900">
                Recently Viewed
              </h2>
              <p className="text-zinc-600 mt-1">Products you've checked out</p>
            </div>
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
                <ChevronLeft className="w-5 h-5 text-zinc-700" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-zinc-700" />
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
            const hasDiscount = product.compare_price && product.compare_price > product.price
            const discountPercent = hasDiscount 
              ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
              : 0

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start"
              >
                <div className="group bg-white rounded-[12px] overflow-hidden border border-zinc-200 shadow-soft hover:shadow-card-hover transition-all duration-350 hover:-translate-y-1 h-full">
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
                      {hasDiscount && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                            {discountPercent}% OFF
                          </span>
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button 
                        onClick={async (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (isInWishlist(product.id)) {
                            await removeFromWishlist(product.id)
                          } else {
                            await addToWishlist(product.id)
                          }
                        }}
                        className={`absolute ${hasDiscount ? 'top-14' : 'top-3'} right-3 w-9 h-9 rounded-[8px] bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100`}
                        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart 
                          className={`w-4 h-4 transition-colors ${
                            isInWishlist(product.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-zinc-600'
                          }`} 
                        />
                      </button>

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
                          <ShoppingCart className="w-4 h-4" />
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
                  <Link href={`/shop/product/${product.id}`} className="block p-4">
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
      </div>
    </section>
  )
}

/**
 * Utility function to add a product to recently viewed
 * Call this from the product detail page
 */
export function addToRecentlyViewed(productId: string) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    let productIds: string[] = stored ? JSON.parse(stored) : []

    // Remove if already exists (to move to front)
    productIds = productIds.filter(id => id !== productId)

    // Add to beginning
    productIds.unshift(productId)

    // Limit to MAX_ITEMS
    if (productIds.length > MAX_ITEMS) {
      productIds = productIds.slice(0, MAX_ITEMS)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds))
  } catch (error) {
    console.error('Error saving to recently viewed:', error)
  }
}
