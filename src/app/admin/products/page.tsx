'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa'

export default function AdminProducts() {
  const { user } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    comparePrice: '',
    image: '',
    description: '',
    category: 'Apparel',
    inventory: '0',
    inStock: true,
    featured: false,
  })

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/admin/products')
      return
    }
    loadProducts()
  }, [user])

  const loadProducts = async () => {
    try {
      const res = await api.get('/products')
      setProducts(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load products', err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : undefined,
        inventory: Number(formData.inventory),
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload)
      } else {
        await api.post('/products', payload)
      }

      setShowForm(false)
      setEditingProduct(null)
      resetForm()
      loadProducts()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save product')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      loadProducts()
    } catch (err) {
      alert('Failed to delete product')
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || '',
      image: product.image || '',
      description: product.description || '',
      category: product.category || 'Apparel',
      inventory: product.inventory?.toString() || '0',
      inStock: product.inStock !== false,
      featured: product.featured || false,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      price: '',
      comparePrice: '',
      image: '',
      description: '',
      category: 'Apparel',
      inventory: '0',
      inStock: true,
      featured: false,
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-brand-dark pt-28 pb-12">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-brand-accent hover:text-brand-primary">
              <FaArrowLeft className="text-2xl" />
            </Link>
            <div>
              <h1 className="text-4xl font-display font-bold">Products</h1>
              <p className="text-brand-light/70">Manage your shop items</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingProduct(null)
              resetForm()
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Product</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Price (LKR) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Compare Price (LKR)</label>
                  <input
                    type="number"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Inventory</label>
                  <input
                    type="number"
                    value={formData.inventory}
                    onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="input-field"
                  placeholder="/images/products/example.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>In Stock</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>Featured</span>
                </label>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                    resetForm()
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">All Products ({products.length})</h2>
          {loading ? (
            <p className="text-center py-8 text-brand-light/70">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-center py-8 text-brand-light/70">No products yet. Add your first one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-light/20">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Stock</th>
                    <th className="text-center py-3 px-4">Featured</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-brand-light/10 hover:bg-brand-light/5">
                      <td className="py-3 px-4 font-semibold">{product.name}</td>
                      <td className="py-3 px-4">LKR {product.price?.toLocaleString()}</td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">
                        <span className={product.inStock ? 'text-green-400' : 'text-red-400'}>
                          {product.inStock ? `${product.inventory} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {product.featured ? '⭐' : ''}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-brand-accent hover:text-brand-primary p-2"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-400 hover:text-red-300 p-2"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
