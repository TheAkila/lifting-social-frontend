'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import api from '@/lib/api'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'

interface ProductGridProps {
  filters: {
    category: string
    subcategory?: string
    sizes: string[]
    priceRange: { min: number; max: number } | null
    inStockOnly: boolean
  }
}

export default function ProductGrid({ filters }: ProductGridProps) {
  const [sortBy, setSortBy] = useState('featured')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 9
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
  // Quick add modal state
  const [quickAddModal, setQuickAddModal] = useState<{
    isOpen: boolean
    product: any | null
    selectedSize: string
    selectedColor: string
  }>({
    isOpen: false,
    product: null,
    selectedSize: '',
    selectedColor: ''
  })

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get(`/products?t=${Date.now()}`)
      .then((res) => {
        if (!mounted) return
        setProducts(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch products', err)
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

    if (filters.category && filters.category !== 'All') {
      if (filters.category === 'apparel') {
        // Apparel includes both men and women categories
        filtered = filtered.filter(
          (product) =>
            product.category?.toLowerCase() === 'men' ||
            product.category?.toLowerCase() === 'women'
        )
      } else {
        filtered = filtered.filter(
          (product) =>
            product.category?.toLowerCase() === filters.category.toLowerCase()
        )
      }
    }

    // Filter by subcategory if provided
    if (filters.subcategory) {
      filtered = filtered.filter(
        (product) =>
          product.subcategory?.toLowerCase() === filters.subcategory?.toLowerCase()
      )
    }

    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes?.some((size: string) => filters.sizes.includes(size))
      )
    }

    if (filters.priceRange) {
      filtered = filtered.filter((product) => {
        const price = product.price || 0
        return (
          price >= filters.priceRange!.min && price <= filters.priceRange!.max
        )
      })
    }

    if (filters.inStockOnly) {
      filtered = filtered.filter((product) => product.inStock !== false)
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        break
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        })
        break
    }

    return filtered
  }, [products, filters, sortBy])

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortBy])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleQuickAdd = (product: any) => {
    // If product has sizes, show modal
    if (product.sizes && product.sizes.length > 0) {
      setQuickAddModal({
        isOpen: true,
        product,
        selectedSize: product.sizes[0],
        selectedColor: product.colors?.[0] || ''
      })
    } else {
      // Add directly to cart without size
      addItem({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: '',
        color: product.colors?.[0] || '',
        image: product.image
      })
    }
  }

  const handleQuickAddConfirm = () => {
    if (!quickAddModal.product) return

    addItem({
      id: quickAddModal.product._id || quickAddModal.product.id,
      name: quickAddModal.product.name,
      price: quickAddModal.product.price,
      quantity: 1,
      size: quickAddModal.selectedSize,
      color: quickAddModal.selectedColor,
      image: quickAddModal.product.image
    })

    setQuickAddModal({ isOpen: false, product: null, selectedSize: '', selectedColor: '' })
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`w-10 h-10 rounded-[8px] text-sm font-medium transition-all duration-200 ${
            currentPage === i
              ? 'bg-zinc-900 text-white'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          {i}
        </button>
      )
    }

    return pages
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-zinc-200">
        <p className="text-sm text-zinc-500">
          {loading ? (
            'Loading...'
          ) : (
            <>
              Showing{' '}
              <span className="text-zinc-900 font-medium">
                {filteredAndSortedProducts.length > 0 ? startIndex + 1 : 0}–{Math.min(endIndex, filteredAndSortedProducts.length)}
              </span>{' '}
              of <span className="text-zinc-900 font-medium">{filteredAndSortedProducts.length}</span> products
            </>
          )}
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-zinc-200 rounded-[8px] px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-zinc-700 focus:outline-none focus:border-zinc-400 transition-colors cursor-pointer w-full sm:w-auto"
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[12px] overflow-hidden border border-zinc-100 animate-pulse">
              <div className="aspect-square bg-zinc-200" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-zinc-200 rounded w-1/4" />
                <div className="h-5 bg-zinc-200 rounded w-3/4" />
                <div className="h-5 bg-zinc-200 rounded w-1/3" />
              </div>
            </div>
          ))
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-zinc-500">
              No products found matching your filters. Try adjusting your selection.
            </p>
          </div>
        ) : (
          currentProducts.map((product, index) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="group bg-white rounded-[12px] overflow-hidden border border-zinc-100 shadow-soft hover:shadow-card-hover transition-all duration-350 hover:-translate-y-1">
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

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.comparePrice && (
                        <span className="bg-brand-accent text-white px-2.5 py-1 rounded-full text-xs font-medium">
                          {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                        </span>
                      )}
                      {product.featured && !product.comparePrice && (
                        <span className="bg-zinc-900 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
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
                      className="absolute top-3 right-3 w-9 h-9 rounded-[8px] bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                      aria-label={isInWishlist(product._id || product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <span className="text-lg">{isInWishlist(product._id || product.id) ? '❤️' : '🤍'}</span>
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
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-[8px] text-sm font-medium flex items-center justify-center gap-2 shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Add to cart"
                      >
                        <span>Quick Add</span>
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
                    {product.comparePrice && (
                      <span className="text-zinc-400 text-sm line-through">
                        LKR {product.comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredAndSortedProducts.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center mt-12 gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded-[8px] flex items-center justify-center transition-all duration-200 ${
              currentPage === 1
                ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
            }`}
            aria-label="Previous page"
          >
            <span className="text-lg">←</span>
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded-[8px] flex items-center justify-center transition-all duration-200 ${
              currentPage === totalPages
                ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
            }`}
            aria-label="Next page"
          >
            <span className="text-lg">→</span>
          </button>
        </div>
      )}

      {/* Quick Add Modal */}
      <AnimatePresence>
        {quickAddModal.isOpen && quickAddModal.product && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickAddModal({ ...quickAddModal, isOpen: false })}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[16px] shadow-2xl z-50 w-[90%] max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-200">
                <h3 className="text-xl font-display font-bold text-zinc-900">Quick Add to Cart</h3>
                <button
                  onClick={() => setQuickAddModal({ ...quickAddModal, isOpen: false })}
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center hover:bg-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Product Info */}
                <div className="flex gap-4 mb-6">
                  <div className="w-20 h-20 rounded-[8px] overflow-hidden bg-zinc-100 flex-shrink-0">
                    {quickAddModal.product.image ? (
                      <img src={quickAddModal.product.image} alt={quickAddModal.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-zinc-900 mb-1">{quickAddModal.product.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-lg text-zinc-900">
                        LKR {quickAddModal.product.price?.toLocaleString()}
                      </span>
                      {quickAddModal.product.comparePrice && (
                        <span className="text-zinc-400 text-sm line-through">
                          LKR {quickAddModal.product.comparePrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Size Selection */}
                {quickAddModal.product.sizes && quickAddModal.product.sizes.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Select Size
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {quickAddModal.product.sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => setQuickAddModal({ ...quickAddModal, selectedSize: size })}
                          className={`py-2 rounded-[8px] text-sm font-medium transition-all ${
                            quickAddModal.selectedSize === size
                              ? 'bg-zinc-900 text-white'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {quickAddModal.product.colors && quickAddModal.product.colors.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Select Color
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {quickAddModal.product.colors.map((color: string) => (
                        <button
                          key={color}
                          onClick={() => setQuickAddModal({ ...quickAddModal, selectedColor: color })}
                          className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-all ${
                            quickAddModal.selectedColor === color
                              ? 'bg-zinc-900 text-white'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setQuickAddModal({ ...quickAddModal, isOpen: false })}
                    className="flex-1 py-3 rounded-[8px] text-sm font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleQuickAddConfirm}
                    className="flex-1 py-3 rounded-[8px] text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
