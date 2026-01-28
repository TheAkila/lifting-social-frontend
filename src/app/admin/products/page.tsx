'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaUpload, FaTimes, FaImage } from 'react-icons/fa'

export default function AdminProducts() {
  const { user } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    comparePrice: '',
    image: '',
    images: [] as string[],
    description: '',
    category: 'Apparel',
    inventory: '0',
    inStock: true,
    featured: false,
    sizes: [] as string[],
    colors: [] as string[],
    material: '',
    care: '',
    features: [] as string[],
  })
  const [newSize, setNewSize] = useState('')
  const [newColor, setNewColor] = useState('')
  const [newFeature, setNewFeature] = useState('')

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)

        const response = await api.post('/uploads', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        if (response.data.url) {
          uploadedUrls.push(response.data.url)
        }
      }

      // Set first image as main image
      const newImages = [...formData.images, ...uploadedUrls]
      setFormData({
        ...formData,
        image: newImages[0] || '',
        images: newImages,
      })

      alert(`Successfully uploaded ${uploadedUrls.length} image(s)`)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      images: newImages,
      image: newImages[0] || '',
    })
  }

  const setMainImage = (index: number) => {
    const newImages = [...formData.images]
    const [selectedImage] = newImages.splice(index, 1)
    newImages.unshift(selectedImage)
    setFormData({
      ...formData,
      images: newImages,
      image: selectedImage,
    })
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
      console.log('Deleting product with ID:', id)
      const response = await api.delete(`/products/${id}`)
      console.log('Delete response:', response.data)
      alert('Product deleted successfully!')
      loadProducts()
    } catch (err: any) {
      console.error('Delete error:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete product'
      alert(`Error: ${errorMsg}`)
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
      images: product.images || [],
      description: product.description || '',
      category: product.category || 'Apparel',
      inventory: product.inventory?.toString() || '0',
      inStock: product.inStock !== false,
      featured: product.featured || false,
      sizes: product.sizes || [],
      colors: product.colors || [],
      material: product.material || '',
      care: product.care || '',
      features: product.features || [],
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
      images: [],
      description: '',
      category: 'Apparel',
      inventory: '0',
      inStock: true,
      featured: false,
      sizes: [],
      colors: [],
      material: '',
      care: '',
      features: [],
    })
  }

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData({ ...formData, sizes: [...formData.sizes, newSize.trim()] })
      setNewSize('')
    }
  }

  const removeSize = (size: string) => {
    setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) })
  }

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData({ ...formData, colors: [...formData.colors, newColor.trim()] })
      setNewColor('')
    }
  }

  const removeColor = (color: string) => {
    setFormData({ ...formData, colors: formData.colors.filter(c => c !== color) })
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] })
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
              <FaArrowLeft className="text-2xl" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600">Manage your shop items</p>
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
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
                    placeholder="product-name-slug"
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
                    placeholder="Original price for discount display"
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

              {/* Image Upload */}
              <div className="border-t border-brand-light/10 pt-6">
                <label className="block text-sm font-semibold mb-3">Product Images</label>
                <div className="space-y-4">
                  {/* Upload Button */}
                  <div>
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`btn-outline flex items-center justify-center space-x-2 cursor-pointer ${
                        uploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-accent border-t-transparent" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <FaUpload />
                          <span>Upload Images</span>
                        </>
                      )}
                    </label>
                    <p className="text-xs text-brand-light/50 mt-2">
                      Upload multiple images. First image will be the main product image.
                    </p>
                  </div>

                  {/* Image Preview Grid */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <div 
                            onClick={() => setMainImage(index)}
                            className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
                          >
                            {img ? (
                              <img
                                src={img}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaImage className="text-3xl text-brand-light/30" />
                              </div>
                            )}
                          </div>
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-brand-primary text-white text-xs px-2 py-1 rounded">
                              Main
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Or use URL */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Or paste image URL</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        className="input-field flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const url = (e.target as HTMLInputElement).value.trim()
                            if (url) {
                              setFormData({
                                ...formData,
                                images: [...formData.images, url],
                                image: formData.image || url,
                              })
                              ;(e.target as HTMLInputElement).value = ''
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          const url = input.value.trim()
                          if (url) {
                            setFormData({
                              ...formData,
                              images: [...formData.images, url],
                              image: formData.image || url,
                            })
                            input.value = ''
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={4}
                  placeholder="Detailed product description..."
                />
              </div>

              {/* Sizes */}
              <div className="border-t border-brand-light/10 pt-6">
                <label className="block text-sm font-semibold mb-3">Available Sizes</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.sizes.map((size) => (
                    <span
                      key={size}
                      className="bg-brand-accent/20 text-brand-accent px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="hover:text-blue-400"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                    placeholder="e.g., S, M, L, XL"
                    className="input-field flex-1"
                  />
                  <button type="button" onClick={addSize} className="btn-outline">
                    Add Size
                  </button>
                </div>
              </div>

              {/* Colors */}
              <div className="border-t border-brand-light/10 pt-6">
                <label className="block text-sm font-semibold mb-3">Available Colors</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.colors.map((color) => (
                    <span
                      key={color}
                      className="bg-brand-secondary/20 text-brand-secondary px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="hover:text-blue-400"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                    placeholder="e.g., Black, Navy, Red"
                    className="input-field flex-1"
                  />
                  <button type="button" onClick={addColor} className="btn-outline">
                    Add Color
                  </button>
                </div>
              </div>

              {/* Material & Care */}
              <div className="border-t border-brand-light/10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Material</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 100% Cotton"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Care Instructions</label>
                  <input
                    type="text"
                    value={formData.care}
                    onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Machine wash cold"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="border-t border-brand-light/10 pt-6">
                <label className="block text-sm font-semibold mb-3">Product Features</label>
                <ul className="space-y-2 mb-3">
                  {formData.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg"
                    >
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <FaTimes />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="Add a product feature..."
                    className="input-field flex-1"
                  />
                  <button type="button" onClick={addFeature} className="btn-outline">
                    Add Feature
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center space-x-6 border-t border-brand-light/10 pt-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>In Stock</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>Featured Product</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 border-t border-brand-light/10 pt-6">
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
                    <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{product.name}</td>
                      <td className="py-3 px-4">LKR {product.price?.toLocaleString()}</td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">
                        <span className={product.inStock ? 'text-green-400' : 'text-blue-400'}>
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
                            className="text-blue-400 hover:text-blue-300 p-2"
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
