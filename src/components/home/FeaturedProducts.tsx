'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, ArrowRight, Sparkles } from 'lucide-react'
import api from '@/lib/api'

interface ProductSection {
  title: string
  category: string
  slug: string
  products: any[]
}

const SECTION_CONFIG = [
  { title: 'Premium Gear for Champions', category: 'Accessories', slug: 'accessories' },
  { title: 'Nutrition for Champions', category: 'Supplements', slug: 'supplements' },
  { title: 'LiftingSocial Merch for Champions', category: 'Apparel', slug: 'apparel' }
]

function ProductCard({ product }: { product: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group h-full"
    >
      <Link href={`/shop/product/${product._id || product.id}`} className="block h-full">
        <div className="bg-white rounded-[12px] overflow-hidden border border-zinc-100 shadow-soft hover:shadow-card-hover transition-all duration-350 hover:-translate-y-1 h-full flex flex-col">
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
          <div className="p-4 flex flex-col flex-grow">
            {/* Category */}
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              {product.category}
            </span>
            
            {/* Product Name */}
            <h3 className="font-display font-semibold text-base text-zinc-900 mt-1 mb-2 line-clamp-2 group-hover:text-brand-accent transition-colors flex-grow">
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
  )
}

export default function FeaturedProducts() {
  const [sections, setSections] = useState<ProductSection[]>([])

  useEffect(() => {
    let mounted = true
    
    const fetchProductsByCategory = async () => {
      try {
        const response = await api.get('/products')
        const allProducts = response.data

        const newSections = SECTION_CONFIG.map(config => ({
          title: config.title,
          category: config.category,
          slug: config.slug,
          products: allProducts
            .filter((product: any) => product.category?.toLowerCase() === config.category.toLowerCase())
            .slice(0, 4)
        }))

        if (mounted) {
          setSections(newSections)
        }
      } catch (err) {
        console.error('Failed to fetch products', err)
      }
    }

    fetchProductsByCategory()
    
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-zinc-50">
      <div className="container mx-auto px-4">
        {/* Render each category section - only show sections with products */}
        {sections.filter(s => s.products.length > 0).map((section, sectionIndex) => (
          <div key={section.category} className={sectionIndex > 0 ? 'mt-16 sm:mt-20 md:mt-24' : ''}>
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900"
                >
                  {section.title}
                </motion.h2>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link
                  href={`/shop?category=${section.slug}`}
                  className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 text-sm font-medium transition-colors group"
                >
                  <span>View all</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
              {section.products.map((product, index) => (
                <div key={product._id || product.id} className={index >= 2 ? 'hidden sm:block' : ''}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
