'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
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
    <section className="section-padding bg-brand-dark">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Featured Collection</h2>
          <p className="section-subtitle">
            Premium gear for serious lifters. Designed in Sri Lanka, built for champions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/shop/product/${product._id || product.id}`}>
                <div className="card-product group">
                  <div className="relative h-64 bg-gray-200 overflow-hidden">
                    {product.image ? (
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{product.name}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white text-brand-dark px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transform scale-90 group-hover:scale-100 transition-transform">
                        <FaShoppingCart />
                        <span>Quick Add</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-brand-accent font-semibold mb-1">{product.category}</p>
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-brand-secondary font-bold text-lg">LKR {product.price?.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/shop" className="btn-primary">View All Products</Link>
        </motion.div>
      </div>
    </section>
  )
}
