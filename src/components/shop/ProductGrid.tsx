'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaShoppingCart, FaHeart } from 'react-icons/fa'
import { useState, useEffect, useMemo } from 'react'
import api from '@/lib/api'

interface ProductGridProps {
  filters: {
    category: string
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

  useEffect(() => {
    let mounted = true
    setLoading(true)
    // Add timestamp to prevent caching
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

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(
        (product) =>
          product.category?.toLowerCase() === filters.category.toLowerCase()
      )
    }

    // Apply size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes?.some((size: string) => filters.sizes.includes(size))
      )
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter((product) => {
        const price = product.price || 0
        return (
          price >= filters.priceRange!.min && price <= filters.priceRange!.max
        )
      })
    }

    // Apply in stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter((product) => product.inStock !== false)
    }

    // Apply sorting
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortBy])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
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
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === i
              ? 'bg-brand-accent text-brand-dark font-bold'
              : 'bg-brand-secondary hover:bg-brand-accent text-brand-light'
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
      {/* Sort Options */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-brand-light/70">
          {loading ? (
            'Loading...'
          ) : (
            <>
              Showing{' '}
              <span className="text-white font-semibold">
                {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProducts.length)}
              </span>{' '}
              of <span className="text-white font-semibold">{filteredAndSortedProducts.length}</span> products
            </>
          )}
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-brand-light/70">Loading products...</p>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-brand-light/70">
              No products found matching your filters. Try adjusting your selection.
            </p>
          </div>
        ) : (
          currentProducts.map((product, index) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="card-product group relative">
                {/* Discount Badge */}
                {product.comparePrice && (
                  <div className="absolute top-4 left-4 z-10 bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                    {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                  </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all">
                  <FaHeart className="text-brand-primary" />
                </button>

                <Link href={`/shop/product/${product._id || product.id}`}>
                  {/* Product Image */}
                  <div className="relative h-72 bg-gray-200 overflow-hidden">
                    {product.image ? (
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center">
                        <span className="text-white/50 font-bold text-lg">
                          {product.name}
                        </span>
                      </div>
                    )}

                    {/* Quick Add Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white text-brand-dark px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transform scale-90 group-hover:scale-100 transition-transform">
                        <FaShoppingCart />
                        <span>Quick Add</span>
                      </button>
                    </div>

                    {/* Out of Stock Overlay */}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">OUT OF STOCK</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-xs text-brand-accent font-semibold mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <p className="text-brand-secondary font-bold text-lg">
                        LKR {product.price?.toLocaleString()}
                      </p>
                      {product.comparePrice && (
                        <p className="text-gray-400 line-through text-sm">
                          LKR {product.comparePrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredAndSortedProducts.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center mt-12 space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === 1
                ? 'bg-brand-secondary/50 text-brand-light/50 cursor-not-allowed'
                : 'bg-brand-secondary hover:bg-brand-accent text-brand-light'
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {renderPageNumbers()}

          {/* Next Button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === totalPages
                ? 'bg-brand-secondary/50 text-brand-light/50 cursor-not-allowed'
                : 'bg-brand-secondary hover:bg-brand-accent text-brand-light'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
