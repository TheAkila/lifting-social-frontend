'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FaShoppingCart, 
  FaHeart, 
  FaChevronLeft, 
  FaStar, 
  FaShippingFast,
  FaCheckCircle,
  FaMinus,
  FaPlus
} from 'react-icons/fa'
import api from '@/lib/api'
import { useCart } from '@/contexts/CartContext'

interface Product {
  _id: string
  id?: string
  name: string
  description: string
  price: number
  comparePrice?: number
  category: string
  image: string
  images?: string[]
  inStock: boolean
  sizes?: string[]
  colors?: string[]
  material?: string
  care?: string
  features?: string[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/products/${params.id}`)
        const productData = response.data
        setProduct(productData)
        
        // Set default selections
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0])
        }
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0])
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product._id || product.id || '',
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.image
    })

    // Show success notification (you can add a toast library later)
    alert(`Added ${quantity} ${product.name} to cart!`)
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark pt-28 pb-12">
        <div className="container-custom">
          <div className="flex items-center justify-center h-96">
            <p className="text-brand-light/70">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-dark pt-28 pb-12">
        <div className="container-custom">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-brand-light mb-4">Product not found</h2>
            <Link href="/shop" className="btn-primary">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image]
  
  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-brand-dark pt-28 pb-12">
      <div className="container-custom">
        {/* Back Button */}
        <Link 
          href="/shop"
          className="inline-flex items-center space-x-2 text-brand-light/70 hover:text-brand-accent transition-colors mb-8"
        >
          <FaChevronLeft />
          <span>Back to Shop</span>
        </Link>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div 
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative h-[500px] bg-gray-200 rounded-xl overflow-hidden"
            >
              {images[selectedImage] ? (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${images[selectedImage]})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center">
                  <span className="text-white/50 font-bold text-2xl">
                    {product.name}
                  </span>
                </div>
              )}
              
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-brand-primary text-white px-4 py-2 rounded-full font-bold">
                  {discount}% OFF
                </div>
              )}

              {/* Out of Stock Overlay */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">OUT OF STOCK</span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-lg overflow-hidden transition-all ${
                      selectedImage === index 
                        ? 'ring-2 ring-brand-accent' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {img ? (
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-300" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <p className="text-brand-accent font-semibold uppercase text-sm tracking-wider">
              {product.category}
            </p>

            {/* Product Name */}
            <h1 className="text-4xl font-display font-bold text-brand-light">
              {product.name}
            </h1>

            {/* Rating (Placeholder) */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <span className="text-brand-light/70">(48 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold text-brand-accent">
                LKR {product.price.toLocaleString()}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-brand-light/50 line-through">
                  LKR {product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-brand-light/70 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-brand-light font-semibold mb-3">
                  Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        selectedSize === size
                          ? 'bg-brand-accent text-white'
                          : 'bg-brand-light/10 text-brand-light hover:bg-brand-light/20'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-brand-light font-semibold mb-3">
                  Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        selectedColor === color
                          ? 'bg-brand-accent text-white'
                          : 'bg-brand-light/10 text-brand-light hover:bg-brand-light/20'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-brand-light font-semibold mb-3">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-brand-light/10 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-brand-light/20 transition-colors rounded-l-lg"
                  >
                    <FaMinus className="text-brand-light" />
                  </button>
                  <span className="px-6 text-brand-light font-bold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-brand-light/20 transition-colors rounded-r-lg"
                  >
                    <FaPlus className="text-brand-light" />
                  </button>
                </div>
                {product.inStock && (
                  <span className="flex items-center space-x-2 text-green-400">
                    <FaCheckCircle />
                    <span>In Stock</span>
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaShoppingCart />
                <span>Add to Cart</span>
              </button>
              <button className="btn-outline w-14 h-14 flex items-center justify-center">
                <FaHeart className="text-xl" />
              </button>
            </div>

            {/* Shipping Info */}
            <div className="border-t border-brand-light/10 pt-6 space-y-3">
              <div className="flex items-center space-x-3 text-brand-light/70">
                <FaShippingFast className="text-2xl text-brand-accent" />
                <span>Free shipping on orders over LKR 5,000</span>
              </div>
              <div className="flex items-center space-x-3 text-brand-light/70">
                <FaCheckCircle className="text-2xl text-green-400" />
                <span>Easy 30-day returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="card mb-12">
          {/* Tab Headers */}
          <div className="flex space-x-8 border-b border-brand-light/10 mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 font-semibold transition-colors relative ${
                activeTab === 'description'
                  ? 'text-brand-accent'
                  : 'text-brand-light/70 hover:text-brand-light'
              }`}
            >
              Description
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 font-semibold transition-colors relative ${
                activeTab === 'details'
                  ? 'text-brand-accent'
                  : 'text-brand-light/70 hover:text-brand-light'
              }`}
            >
              Details
              {activeTab === 'details' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 font-semibold transition-colors relative ${
                activeTab === 'reviews'
                  ? 'text-brand-accent'
                  : 'text-brand-light/70 hover:text-brand-light'
              }`}
            >
              Reviews
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-brand-light/70">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="leading-relaxed">{product.description}</p>
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-brand-light font-semibold mb-3">Key Features:</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <FaCheckCircle className="text-brand-accent mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-4">
                {product.material && (
                  <div>
                    <strong className="text-brand-light">Material:</strong> {product.material}
                  </div>
                )}
                {product.care && (
                  <div>
                    <strong className="text-brand-light">Care Instructions:</strong> {product.care}
                  </div>
                )}
                <div>
                  <strong className="text-brand-light">Category:</strong> {product.category}
                </div>
                <div>
                  <strong className="text-brand-light">Availability:</strong>{' '}
                  {product.inStock ? (
                    <span className="text-green-400">In Stock</span>
                  ) : (
                    <span className="text-red-400">Out of Stock</span>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-8">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl font-display font-bold text-brand-light mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for related products - you can implement this later */}
            <div className="text-center text-brand-light/50 col-span-full py-8">
              Related products coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
