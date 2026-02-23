'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'

export default function AdminBundles() {
  const { user } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center">
            <div className="text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  return <BundleOffersView />
}

function BundleOffersView() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBundleOffers()
  }, [])

  const loadBundleOffers = async () => {
    try {
      const res = await api.get('/products')
      const bundleProducts = res.data.filter((p: any) => p.bundleOffer === true)
      setProducts(bundleProducts)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load bundle offers', err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
              <FaArrowLeft className="text-2xl" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Bundle Offers</h1>
              <p className="text-gray-600">Products marked as bundle offers</p>
            </div>
          </div>
          <Link href="/admin/products">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Manage Products
            </button>
          </Link>
        </div>

        {/* Bundle Offers List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No bundle offers yet. Go to Products and mark items as "Bundle Offer"
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product._id || product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        LKR {product.price?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          product.inStock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/admin/products`}>
                          <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            Edit
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
