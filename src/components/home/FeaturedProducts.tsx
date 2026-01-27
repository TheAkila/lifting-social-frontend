'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, ArrowRight, Sparkles } from 'lucide-react'
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
    <section className="py-12 sm:py-16 md:py-20 bg-zinc-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-xs font-medium mb-4"
            >
              <Sparkles className="w-3 h-3" />
              <span>Featured Collection</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900"
            >
              Premium Gear for Champions
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 text-sm font-medium transition-colors group"
            >
              <span>View all products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/shop/product/${product._id || product.id}`} className="block">
                <div className="bg-white rounded-[12px] overflow-hidden border border-zinc-100 shadow-soft hover:shadow-card-hover transition-all duration-350 hover:-translate-y-1">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-zinc-100 overflow-hidden">
                    {product.image ? (
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                        style={{ backgroundImage: `url(${product.image})` }} 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                        <span className="text-white font-display font-semibold text-lg text-center px-4">{product.name}</span>
                      </div>
                    )}
                    
                    {/* Quick Add Button */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-[8px] text-sm font-medium flex items-center justify-center gap-2 shadow-lg transition-colors">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Quick Add</span>
                      </button>
                    </div>
                    
                    {/* Badge */}
                    {product.featured && (
                      <div className="absolute top-3 left-3 bg-brand-accent text-white px-2.5 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category */}
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      {product.category}
                    </span>
                    
                    {/* Product Name */}
                    <h3 className="font-display font-semibold text-base text-zinc-900 mt-1 mb-2 line-clamp-2 group-hover:text-brand-accent transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-lg text-zinc-900">
                        LKR {product.price?.toLocaleString()}
                      </span>
                      <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-brand-accent group-hover:translate-x-0.5 transition-all" />
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
