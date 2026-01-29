'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import api from '@/lib/api'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    api
      .get('/products')
      .then((res) => {
        if (!mounted) return
        setProducts(res.data.slice(0, 4))
      })
      .catch((err) => {
        console.error('Failed to fetch products', err)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 sm:gap-6 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl sm:text-5xl lg:text-5xl font-bold text-black mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-600 text-lg max-w-lg">
              Handpicked premium gear designed for performance and style
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-black hover:text-gray-600 text-base font-semibold transition-colors group whitespace-nowrap"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group h-full"
            >
              <Link href={`/shop/product/${product._id || product.id}`} className="block h-full">
                <div className="flex flex-col h-full">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden rounded-xl mb-5">
                    {product.image ? (
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" 
                        style={{ backgroundImage: `url(${product.image})` }} 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black flex items-center justify-center">
                        <span className="text-white font-display font-semibold text-lg text-center px-4">{product.name}</span>
                      </div>
                    )}
                    
                    {/* Badge */}
                    {product.featured && (
                      <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}

                    {/* Quick Add Button */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-full bg-white hover:bg-gray-50 text-black py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Quick Add</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    {/* Category */}
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {product.category || 'Gear'}
                    </span>
                    
                    {/* Product Name */}
                    <h3 className="font-display font-bold text-lg text-black mb-3 group-hover:text-gray-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {/* Price & Arrow */}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-display font-bold text-xl text-black">
                        LKR {product.price?.toLocaleString()}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-500">Loading products...</p>
          </div>
        )}
      </div>
    </section>
  )
}
