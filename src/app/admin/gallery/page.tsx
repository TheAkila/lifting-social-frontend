'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'

export default function GalleryManagementPage() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [category, setCategory] = useState('Competition')

  const categories = ['Competition', 'Training', 'Moments', 'Events', 'Team', 'Other']

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, GIF, WebP)')
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    try {
      setError('')
      setSuccess('')
      setUploading(true)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', category)
      formData.append('title', file.name.replace(/\.[^/.]+$/, '')) // Filename without extension
      formData.append('alt_text', `${category} image - ${file.name}`)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setSuccess(`✅ Image uploaded successfully: ${file.name}`)
      
      // Reset after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black pt-20 sm:pt-28 md:pt-32 pb-8 sm:pb-12 md:pb-16">
      <div className="container mx-auto px-3 sm:px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
            Gallery Management
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg">
            Upload sports photography images to the gallery
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 shadow-2xl">
          {/* Category Selector */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-sm sm:text-base font-semibold text-zinc-900 mb-2 sm:mb-3">
              Image Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 sm:mt-2">
              <span className="font-medium">Competition/Training/Moments:</span> Sports Photography gallery
              {' • '}
              <span className="font-medium">Events:</span> Live Events gallery
            </p>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 sm:border-3 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-zinc-300 bg-zinc-50 hover:border-blue-400'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              disabled={uploading}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="block cursor-pointer">
              {uploading ? (
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <div className="animate-spin">
                    <Upload className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-blue-600" />
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-zinc-700">Uploading image...</div>
                  <div className="w-full max-w-xs bg-zinc-200 rounded-full h-2 sm:h-3 overflow-hidden">
                    <div className="bg-blue-600 h-2 sm:h-3 rounded-full animate-pulse w-full" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                  <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Upload className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900">Drag and drop your image</div>
                  <div className="text-sm sm:text-base text-zinc-600">or click to select from your computer</div>
                  <div className="text-xs sm:text-sm text-zinc-500 pt-1 sm:pt-2">
                    Supported formats: PNG, JPG, GIF, WebP (Max 10MB)
                  </div>
                </div>
              )}
            </label>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold text-sm sm:text-base">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold text-sm sm:text-base">❌ {error}</p>
            </div>
          )}

          {/* Setup Error */}
          {error?.includes('API') && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-900 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Setup Required:</p>
              <ol className="text-amber-800 text-xs sm:text-sm space-y-1 sm:space-y-2 list-decimal list-inside">
                <li>Run the database migration in Supabase (migrations/create_gallery_images_table.sql)</li>
                <li>Ensure NEXT_PUBLIC_API_URL is set in .env.local</li>
                <li>Restart your development server</li>
              </ol>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-zinc-50 rounded-xl border border-zinc-200">
            <h3 className="font-semibold text-zinc-900 mb-2 sm:mb-3 text-base sm:text-lg">Upload Requirements:</h3>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-zinc-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5 flex-shrink-0">•</span>
                <span>Images are automatically optimized and stored in Cloudinary</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5 flex-shrink-0">•</span>
                <span>Maximum file size: 10MB</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5 flex-shrink-0">•</span>
                <span>Supported formats: PNG, JPG, GIF, WebP</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5 flex-shrink-0">•</span>
                <span>All images are automatically displayed on the Sports Media gallery page</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
